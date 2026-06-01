# -*- coding: utf-8 -*-
# @author: Rebort
from typing import Annotated, Any

from fastapi import APIRouter, Depends, Path
from fastapi.responses import JSONResponse

from app.api.v1.chenreact_system.auth.schema import AuthSchema
from app.common.response import ResponseSchema, SuccessResponse
from app.core.base_params import PaginationQueryParam
from app.core.dependencies import AuthPermission
from app.core.logger import log
from app.core.router_class import OperationLogRoute

from .schema import (
    AiChatRequestSchema,
    AiChatResponseSchema,
    ChatSessionCreateSchema,
    ChatSessionQueryParam,
    ChatSessionUpdateSchema,
)
from .service import ChatService

ChatRouter = APIRouter(route_class=OperationLogRoute, prefix="/chat", tags=["AI聊天会话管理"])


@ChatRouter.get(
    "/detail/{session_id}",
    summary="获取会话详情",
    description="获取会话详情",
    response_model=ResponseSchema[dict[str, Any]],
)
async def get_session_detail_controller(
    session_id: Annotated[str, Path(description="会话ID")],
    auth: Annotated[AuthSchema, Depends(AuthPermission(["chenreact_ai:chat:detail"]))],
) -> JSONResponse:
    """
    获取会话详情

    参数:
    - session_id (str): 会话ID
    - auth (AuthSchema): 认证信息模型

    返回:
    - JSONResponse: 包含会话详情的JSON响应
    """
    result = await ChatService.get_session_service(auth=auth, session_id=session_id)
    log.info(f"获取会话详情成功 {session_id}")
    return SuccessResponse(data=result, msg="获取会话详情成功")


@ChatRouter.get(
    "/list",
    summary="查询会话列表",
    description="查询会话列表",
    response_model=ResponseSchema[dict],
)
async def get_session_list_controller(
    page: Annotated[PaginationQueryParam, Depends()],
    search: Annotated[ChatSessionQueryParam, Depends()],
    auth: Annotated[AuthSchema, Depends(AuthPermission(["chenreact_ai:chat:query"]))],
) -> JSONResponse:
    """
    查询会话列表

    参数:
    - page (PaginationQueryParam): 分页查询参数
    - search (ChatSessionQueryParam): 查询参数
    - auth (AuthSchema): 认证信息模型

    返回:
    - JSONResponse: 包含会话列表分页信息的JSON响应
    """
    result_dict = await ChatService.page_service(
        auth=auth,
        page_no=page.page_no,
        page_size=page.page_size,
        search=search,
        order_by=page.order_by,
    )
    log.info("查询会话列表成功")
    return SuccessResponse(data=result_dict, msg="查询会话列表成功")


@ChatRouter.post(
    "/create",
    summary="创建会话",
    description="创建会话",
    response_model=ResponseSchema[dict[str, Any]],
)
async def create_session_controller(
    data: ChatSessionCreateSchema,
    auth: Annotated[AuthSchema, Depends(AuthPermission(["chenreact_ai:chat:create"]))],
) -> JSONResponse:
    """
    创建会话

    参数:
    - data (ChatSessionCreateSchema): 会话创建模型
    - auth (AuthSchema): 认证信息模型

    返回:
    - JSONResponse: 包含创建会话详情的JSON响应
    """
    result = await ChatService.create_service(auth=auth, data=data)
    if result:
        log.info(f"创建会话成功 {result.get('session_id')}")
    return SuccessResponse(data=result, msg="创建会话成功")


@ChatRouter.put(
    "/update/{session_id}",
    summary="更新会话",
    description="更新会话",
    response_model=ResponseSchema[None],
)
async def update_session_controller(
    session_id: Annotated[str, Path(description="会话ID")],
    data: ChatSessionUpdateSchema,
    auth: Annotated[AuthSchema, Depends(AuthPermission(["chenreact_ai:chat:update"]))],
) -> JSONResponse:
    """
    更新会话

    参数:
    - session_id (str): 会话ID
    - data (ChatSessionUpdateSchema): 会话更新模型
    - auth (AuthSchema): 认证信息模型

    返回:
    - JSONResponse: 包含更新会话详情的JSON响应
    """
    await ChatService.update_service(auth=auth, session_id=session_id, data=data)
    log.info(f"更新会话成功 {session_id}")
    return SuccessResponse(data=None, msg="更新会话成功")


@ChatRouter.delete(
    "/delete",
    summary="删除会话",
    description="删除会话",
    response_model=ResponseSchema[None],
)
async def delete_session_controller(
    session_ids: list[str],
    auth: Annotated[AuthSchema, Depends(AuthPermission(["chenreact_ai:chat:delete"]))],
) -> JSONResponse:
    """
    删除会话

    参数:
    - session_ids (list[str]): 会话ID列表
    - auth (AuthSchema): 认证信息模型

    返回:
    - JSONResponse: 包含删除结果的JSON响应
    """
    await ChatService.delete_service(auth=auth, session_ids=session_ids)
    log.info(f"删除会话成功 {session_ids}")
    return SuccessResponse(data=None, msg="删除会话成功")


@ChatRouter.post(
    "/ai-chat",
    summary="AI 对话（非流式）",
    description="AI 对话接口，用于 AiAssistant 组件，返回完整响应",
    response_model=ResponseSchema[AiChatResponseSchema],
)
async def ai_chat_controller(
    data: AiChatRequestSchema,
    auth: Annotated[AuthSchema, Depends(AuthPermission(["chenreact_ai:chat:query"]))],
) -> JSONResponse:
    """
    AI 对话（非流式）

    参数:
    - data (AiChatRequestSchema): 对话请求数据
    - auth (AuthSchema): 认证信息模型

    返回:
    - JSONResponse: 包含 AI 回复、会话ID和函数调用信息的JSON响应
    """
    result = await ChatService.chat_non_stream(
        message=data.message,
        session_id=data.session_id,
        auth=auth,
    )
    log.info(f"AI 对话成功 {result.get('session_id')}")
    return SuccessResponse(
        data=AiChatResponseSchema(
            response=result["response"],
            session_id=result["session_id"],
            function_calls=result.get("function_calls"),
            action=result.get("action"),
        ),
        msg="对话成功",
    )
