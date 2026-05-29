from typing import Annotated

from starlette.responses import HTMLResponse
from typing_extensions import Doc


def get_custom_ui_html(
    *,
    openapi_url: Annotated[
        str,
        Doc(
            """
            The OpenAPI URL that Swagger UI should load and use.

            This is normally done automatically by FastAPI using the default URL
            `/openapi.json`.
            """
        ),
    ],
    title: Annotated[
        str,
        Doc(
            """
            The HTML `<title>` content, normally shown in the browser tab.
            """
        ),
    ],
    swagger_js_url: Annotated[
        str,
        Doc(
            """
            The URL to use to load the Swagger UI JavaScript.

            It is normally set to a CDN URL.
            """
        ),
    ] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
    swagger_css_url: Annotated[
        str,
        Doc(
            """
            The URL to use to load the Swagger UI CSS.

            It is normally set to a CDN URL.
            """
        ),
    ] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
    swagger_favicon_url: Annotated[
        str,
        Doc(
            """
            The URL of the favicon to use. It is normally shown in the browser tab.
            """
        ),
    ] = "https://fastapi.tiangolo.com/img/favicon.png",
) -> HTMLResponse:
    """
    生成加载 Swagger UI 的 HTML 页面（与 FastAPI 默认 `/docs` 行为一致，可自定义静态资源 URL）。

    参数:
    - openapi_url (str): OpenAPI JSON 地址。
    - title (str): 页面标题。
    - swagger_js_url (str): Swagger UI JS 地址。
    - swagger_css_url (str): Swagger UI CSS 地址。
    - swagger_favicon_url (str): 站点图标地址。

    返回:
    - HTMLResponse: 可直接返回给浏览器的 HTML 响应。
    """
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
    <link type="text/css" rel="stylesheet" href="{swagger_css_url}">
    <link rel="shortcut icon" href="{swagger_favicon_url}">
    <title>{title}</title>
    </head>
    <body>
    <div id="swagger-ui"></div>
    <script src="{swagger_js_url}"></script>
    <script>
        ui.configure({{url: '{openapi_url}'}});
        ui.initialize();
    </script>
    </body>
    </html>
    """
    return HTMLResponse(html)
