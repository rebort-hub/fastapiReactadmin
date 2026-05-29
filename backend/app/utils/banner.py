from app.config.path_conf import BANNER_FILE
from app.core.logger import log


def worship(env: str) -> None:
    """
    读取并打印启动 Banner（优先 `banner.txt`，并附带当前环境名）。

    参数:
    - env (str): 当前运行环境标识。

    返回:
    - None
    """
    if BANNER_FILE.exists():
        banner = BANNER_FILE.read_text(encoding="utf-8")
        banner = f"🚀 当前运行环境: {env}\n{banner}"
        log.info(banner)
