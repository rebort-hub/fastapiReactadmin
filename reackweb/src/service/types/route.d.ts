/**
 * 命名空间 Api.Route
 *
 * 后端 API 模块：路由模块
 */
declare namespace Api {
  namespace Route {
    /** 优雅常量路由类型 */
    type ElegantConstRoute = import('@soybean-react/vite-plugin-react-router').ElegantConstRoute;

    /** 菜单路由 */
    interface MenuRoute extends ElegantConstRoute {
      /** 路由 ID */
      id: string;
    }

    /** 用户路由 */
    interface UserRoute {
      /** 用户首页路由键 */
      home: import('@soybean-react/vite-plugin-react-router').LastLevelRouteKey;
      /** 用户可访问的路由列表 */
      routes: string[];
    }

    /** 后端返回的完整路由结构 */
    interface BackendRouteResponse {
      /** 用户首页路由键 */
      home: import('@soybean-react/vite-plugin-react-router').LastLevelRouteKey;
      /** 用户可访问的路由列表 */
      routes: BackendRoute[];
    }

    interface BackendRoute {
      children?: BackendRoute[];
      /** 组件标识，用来在前端映射到 layouts/pages（ */
      component?: string;
      /** 路由元信息，全部放在 handle 里 */
      handle: Router.RouteHandle;
      /** 布局标识，用来在前端映射到 layouts */
      layout?: string;
      /** 路由唯一标识 */
      name: string;
      /** 路由 path */
      path: string;
      /** 重定向 */
      redirect?: string;
    }
  }
}
