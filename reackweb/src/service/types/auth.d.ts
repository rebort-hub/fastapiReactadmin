/**
 * 命名空间 Api.Auth
 *
 * 后端 API 模块：认证模块
 */
declare namespace Api {
  namespace Auth {
    /** 第三方 OAuth 渠道 */
    type OAuthProvider = 'gitee' | 'github' | 'qq' | 'wechat';

    /** 登录请求参数 */
    type LoginParams = {
      captcha?: string;
      captchaKey?: string;
      loginType?: string;
      /** 密码 */
      password: string;
      /** 用户名 */
      userName: string;
    };

    /** 登录响应数据 */
    type LoginResponse = LoginToken;

    /** 登录令牌 */
    interface LoginToken {
      /** 刷新令牌 */
      refreshToken: string;
      /** 访问令牌 */
      token: string;
    }

    /** 用户信息 */
    interface UserInfo {
      /** 用户按钮权限列表 */
      buttons: string[];
      /** 用户角色列表 */
      roles: string[];
      /** 用户 ID */
      userId: string;
      /** 用户名 */
      userName: string;
    }

    /** 用户注册 */
    interface RegisterParams {
      password: string;
      username: string;
    }

    /** 忘记密码 */
    interface ForgetPasswordParams {
      mobile?: string;
      newPassword: string;
      username: string;
    }

    /** 验证码 */
    interface CaptchaInfo {
      enable: boolean;
      imgBase: string;
      key: string;
    }

    /** 用户认证信息 */
    type Info = {
      /** 访问令牌 */
      token: LoginToken['token'];
      /** 用户信息 */
      userInfo: UserInfo;
    };
  }
}
