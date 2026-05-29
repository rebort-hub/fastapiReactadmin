import json

from fastapi import APIRouter, WebSocket

from app.core.database import async_db_session
from app.core.dependencies import _verify_token
from app.core.logger import log
from app.core.router_class import OperationLogRoute

from .schema import ChatQuerySchema
from .service import ChatService

WS_AI = APIRouter(
    route_class=OperationLogRoute,
    prefix="/ai/chat",
    tags=["智能助手WebSocket"],
)


@WS_AI.websocket("/ws", name="WebSocket聊天")
async def websocket_chat_controller(
    websocket: WebSocket,
) -> None:
    """
    WebSocket 聊天接口。

    参数:
    - websocket (WebSocket): WebSocket 连接。

    返回:
    - None: 长连接处理完毕或关闭后无返回值。

    支持两种消息格式：
    1. 纯文本：直接发送消息内容
    2. JSON 格式：{"message": "消息内容", "session_id": "会话ID", "files": [...]}

    ws://127.0.0.1:8001/api/v1/ai/chat/ws?token=xxx
    """
    await websocket.accept()

    # 从查询参数获取token并认证
    token = websocket.query_params.get("token")
    if token:
        try:
            # 获取数据库和redis连接
            async with async_db_session() as db:
                redis = websocket.app.state.redis
                auth = await _verify_token(token, db, redis)
                user_info = f"用户: {auth.user.username}" if auth and auth.user else "未认证用户"
                log.info(f"WebSocket连接已建立: {websocket.client} - {user_info}")

                # 保存用户信息到websocket状态
                websocket.state.auth = auth

                # 进入消息循环
                while True:
                    data = await websocket.receive_text()
                    try:
                        message_data = json.loads(data)
                        query = ChatQuerySchema(**message_data)
                        log.info(f"收到聊天查询: {query}- 会话ID: {query.session_id}")

                        # 处理AI回复（使用 agno 记忆存储）
                        chat_result = ChatService.chat_query(query=query, auth=auth)
                        async for chunk in chat_result:
                            if chunk:
                                try:
                                    await websocket.send_text(chunk)
                                except RuntimeError:
                                    log.warning("WebSocket连接已关闭，停止发送消息")
                                    break
                    except json.JSONDecodeError:
                        log.warning(f"收到非JSON消息: {data}")
                        try:
                            await websocket.send_text("消息格式错误，请发送JSON格式的消息")
                        except RuntimeError:
                            log.warning("WebSocket连接已关闭，无法发送错误消息")
                            break
                    except Exception as e:
                        log.error(f"处理消息时出错: {e}")
                        try:
                            await websocket.send_text(f"处理消息时出错: {str(e)}")
                        except RuntimeError:
                            log.warning("WebSocket连接已关闭，无法发送错误消息")
                            break
        except Exception as e:
            log.warning(f"WebSocket认证失败或聊天出错: {e}")
            try:
                await websocket.send_text(f"错误: {str(e)}")
            except RuntimeError:
                log.warning("WebSocket连接已关闭，无法发送错误消息")
            finally:
                try:
                    await websocket.close()
                except RuntimeError:
                    pass
            return
    else:
        log.warning(f"WebSocket连接未提供token: {websocket.client}")
        try:
            await websocket.send_text("未提供认证token，请重新登录")
        except RuntimeError:
            log.warning("WebSocket连接已关闭，无法发送错误消息")
        finally:
            try:
                await websocket.close()
            except RuntimeError:
                pass
        return
