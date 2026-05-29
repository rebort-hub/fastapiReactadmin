<div align="center">
 <img src="./public/favicon.svg" width="160" />
 <h1>FastapiReactAdmin</h1>
  <span><a href="./README.md">English</a> | 中文</span>
</div>

---

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

> 
> 如果您觉得 `fastapiReactadmin` 对您有所帮助，或者您喜欢我们的项目，请在 GitHub 上给我们一个 ⭐️。您的支持是我们持续改进和增加新功能的动力！感谢您的支持！

## 特别鸣谢

本项目是基于 [Soybean](https://github.com/honghuangdc) 开发的优秀开源项目

## 简介


**为什么选择 fastapiReactadmin？**

- 🎯 **与时俱进**: 采用最新前端技术栈（React 19、Vite 6、TypeScript 5.7），紧跟技术潮流
- 💪 **功能强大**: 集成 TanStack Query、Redux Toolkit 等业界最佳实践，提供完整的企业级解决方案
- ✨ **架构优雅**: 清晰的分层架构、模块化设计、完善的类型系统，代码质量堪称典范
- 📐 **规范性强**: 严格的代码规范、统一的项目结构、标准化的开发流程，适合团队协作

项目采用了最新的前端技术栈:

### 核心技术栈

- 🚀 **React 19** - 最新的 React 版本，享受最前沿的特性
- 🛤️ **React Router V7** - 强大的路由管理系统
- 📦 **Redux Toolkit** - 现代化的状态管理方案
- 🔄 **TanStack Query (React Query) 5** - 强大的服务端状态管理方案
- 🎨 **Ant Design 5.24** - 企业级 UI 组件库
- ⚡️ **Vite 6** - 极速的开发构建工具
- 🎯 **TypeScript 5.7** - 完善的类型系统
- 🌈 **UnoCSS** - 高性能的原子化 CSS 引擎
- 📦 **pnpm monorepo** - 高效的包管理方案

### 项目特点

- 💡 **代码质量** - 代码规范严谨，架构清晰优雅，完善的 TypeScript 类型支持
- ⚡️ **开箱即用** - 无需复杂配置，快速启动项目开发
- 🛠️ **丰富组件** - 内置大量业务组件和主题配置选项
- 📋 **约定式路由** - 自动化的文件路由系统，类似 Next.js 的开发体验
- 🔄 **数据管理** - 集成 TanStack Query，优雅的服务端状态管理，自动缓存、重新验证
- 🏗️ **架构设计** - 分层清晰的 Service 层架构，URL、Keys、Hooks 分离，高度模块化
- 🎨 **主题系统** - 支持暗黑模式、多主题色、布局配置等
- 🌍 **国际化** - 完整的 i18n 方案，支持多语言切换
- 🔐 **权限管理** - 基于角色的权限控制系统（RBAC）
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🎯 **乐观 UI** - 自动错误捕获和友好的错误界面，支持组件级监控埋点
- 🔧 **CLI 工具** - 内置命令行工具（Git 提交规范、代码清理、版本发布等）
- ⚙️ **Keep-Alive** - 页面缓存功能，提升用户体验
- 🎭 **动画效果** - 基于 Motion 的流畅动画系统

### Monorepo 架构

项目采用 pnpm workspace 管理，包含以下子包：

- 📡 **@sa/axios** - 封装的 HTTP 请求库，支持拦截器、错误处理等
- 🎨 **@sa/color** - 主题颜色处理工具库
- 🪝 **@sa/hooks** - 常用 React Hooks 集合（useBoolean、useArray 等）
- 🧩 **@sa/materials** - 通用组件库（AdminLayout、PageTab、SimpleScrollbar 等）
- 🛠️ **@sa/scripts** - 命令行工具集（代码生成、Git 工具、发布工具等）
- 🔧 **@sa/utils** - 通用工具函数库
- 🎯 **@sa/uno-preset** - UnoCSS 自定义预设配置

无论是学习最新前端技术,还是开发企业级中后台项目,fastapiReactadmin都是您的不二之选。

## 分支

- `master` 分支: 最新稳定版本,基于 React19 + ReactRouter V7  版本


### 技术栈版本

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.0.0 | 核心框架 |
| React Router | 7.2.0 | 路由管理 |
| Redux Toolkit | 2.5.1 | 状态管理 |
| TanStack Query | 5.90.8 | 数据获取和缓存 |
| Ant Design | 5.24.1 | UI 组件库 |
| Vite | 6.1.1 | 构建工具 |
| TypeScript | 5.7.3 | 类型系统 |
| UnoCSS | 66.0.0 | 原子化 CSS |
| Motion | 12.4.7 | 动画库 |
| pnpm | 10.4.1 | 包管理器 |

## 项目结构

```
reackweb/
├── build/                    # 构建配置
│   ├── config/              # Vite 配置（代理、时间等）
│   ├── optimize/            # 构建优化配置
│   └── plugins/             # Vite 插件配置
├── packages/                # Monorepo 子包
│   ├── axios/              # HTTP 请求封装
│   ├── color/              # 颜色工具
│   ├── hooks/              # React Hooks 集合
│   ├── materials/          # 通用组件库
│   ├── scripts/            # CLI 工具
│   ├── uno-preset/         # UnoCSS 预设
│   └── utils/              # 工具函数库
├── src/
│   ├── assets/             # 静态资源
│   ├── components/         # 全局组件
│   ├── constants/          # 常量定义
│   ├── features/           # 功能模块
│   │   ├── auth/          # 认证模块
│   │   ├── theme/         # 主题模块
│   │   ├── router/        # 路由模块
│   │   ├── menu/          # 菜单模块
│   │   ├── tab/           # 标签页模块
│   │   ├── lang/          # 国际化模块
│   │   └── ...
│   ├── hooks/              # 业务 Hooks
│   ├── layouts/            # 布局组件
│   ├── locales/            # 国际化配置
│   ├── pages/              # 页面组件（约定式路由）
│   │   ├── (base)/        # 基础布局页面
│   │   ├── (blank)/       # 空白布局页面
│   │   └── _builtin/      # 内置页面
│   ├── router/             # 路由配置
│   ├── service/            # API 服务层（优雅的分层架构）✨
│   │   ├── api/           # API 请求函数
│   │   ├── enums/         # 业务枚举定义
│   │   ├── hooks/         # React Query Hooks 封装
│   │   ├── keys/          # React Query Keys 全局管理
│   │   ├── types/         # TypeScript 类型定义
│   │   ├── urls/          # API URL 常量管理
│   │   └── request/       # 请求配置和拦截器
│   ├── store/              # Redux 状态管理
│   ├── styles/             # 全局样式
│   ├── theme/              # 主题配置
│   ├── types/              # TypeScript 类型定义
│   └── utils/              # 工具函数
└── ...配置文件
```

## 快速开始

### 环境准备

确保你的环境满足以下要求：

- **git**: 用于克隆和管理项目版本
- **Node.js**: >=18.12.0，推荐 18.19.0 或更高
- **pnpm**: >= 8.7.0，推荐 10.4.1 或更高

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/rebort-hub/fastapiReactadmin
cd reackweb
```

2. **安装依赖**

```bash
pnpm install
```

> ⚠️ 由于本项目采用了 pnpm monorepo 的管理方式，请不要使用 npm 或 yarn 来安装依赖。

3. **启动开发服务器**

```bash
pnpm dev
```

开发服务器将在 `http://localhost:9527` 启动

4. **构建生产版本**

```bash
# 生产环境构建
pnpm build

# 测试环境构建
pnpm build:test
```

### 其他可用命令

```bash
# 类型检查
pnpm typecheck

# 代码格式化和修复
pnpm lint

# Git 提交（符合规范）
pnpm commit

# 路由生成
pnpm gen-route

# 清理缓存和依赖
pnpm cleanup

# 版本发布
pnpm release

# 预览构建产物
pnpm preview
```

## 核心功能

### 🎨 主题系统

- **多主题色**: 内置多种主题颜色，支持自定义主题色
- **暗黑模式**: 完整的暗黑模式支持，自动适配系统主题
- **布局模式**: 支持垂直、水平、混合等多种布局模式
- **主题配置**: 可视化的主题配置面板，实时预览
- **配置导出**: 支持主题配置的导出和导入

### 🔐 权限管理

- **角色权限**: 基于 RBAC 的角色权限控制
- **菜单权限**: 根据用户角色动态生成菜单
- **按钮权限**: 细粒度的按钮级权限控制
- **路由守卫**: 完善的路由前置守卫和权限验证
- **动态路由**: 支持根据权限动态添加路由

### 🛤️ 路由系统

- **约定式路由**: 基于文件系统的自动路由生成
- **动态路由**: 支持动态参数路由 `[id]`、`[...slug]` 等
- **路由缓存**: Keep-Alive 页面缓存功能
- **路由动画**: 页面切换动画效果
- **面包屑**: 自动生成面包屑导航
- **路由元信息**: 丰富的路由元数据配置

### 📱 标签页系统

- **多标签页**: Chrome 风格的多标签页管理
- **右键菜单**: 关闭、刷新、固定等操作
- **标签拖拽**: 支持标签页拖拽排序
- **标签缓存**: 标签页状态持久化
- **快捷操作**: 关闭其他、关闭左侧、关闭右侧等

### 🌍 国际化

- **多语言**: 支持中文、英文等多语言
- **动态切换**: 语言实时切换，无需刷新
- **Antd 集成**: 完整的 Antd 组件国际化
- **Dayjs 集成**: 日期时间国际化支持

### 🔄 数据管理

#### TanStack Query 集成

项目深度集成了 TanStack Query (React Query)，提供优雅、强大的服务端状态管理方案：

**架构设计**

采用分层设计，清晰优雅的代码组织：

- **urls/**: URL 常量集中管理，避免硬编码
  ```typescript
  // src/service/urls/auth.ts
  export const AUTH_URLS = {
    LOGIN: '/auth/login',
    GET_USER_INFO: '/auth/getUserInfo',
    REFRESH_TOKEN: '/auth/refreshToken'
  } as const;
  ```

- **keys/**: React Query Keys 全局唯一管理
  ```typescript
  // src/service/keys/index.ts
  export const QUERY_KEYS = {
    AUTH: {
      USER_INFO: ['auth', 'userInfo'] as const
    }
  } as const;
  ```

- **api/**: 原生 API 请求函数
  ```typescript
  // src/service/api/auth.ts
  export function fetchLogin(userName: string, password: string) {
    return request<Api.Auth.LoginToken>({
      url: AUTH_URLS.LOGIN,
      method: 'post',
      data: { userName, password }
    });
  }
  ```

- **hooks/**: React Query Hooks 封装
  ```typescript
  // src/service/hooks/useAuth.ts
  export function useLogin() {
    return useMutation({
      mutationKey: MUTATION_KEYS.AUTH.LOGIN,
      mutationFn: ({ userName, password }) => fetchLogin(userName, password)
    });
  }
  ```

**核心特性**

- ✨ **自动缓存**: 智能缓存管理，减少不必要的网络请求
- 🔄 **自动重新验证**: 数据过期自动重新获取，保持数据新鲜
- ⚡️ **并发请求**: 自动去重和批处理并发请求
- 🎯 **乐观更新**: 支持乐观 UI 更新，提升用户体验
- 🔌 **离线支持**: 离线状态下的数据缓存和同步
- 📊 **DevTools**: 强大的开发者工具，实时查看请求状态

**使用示例**

```typescript
// 在组件中使用
import { useLogin, useUserInfo } from '@/service/hooks';

function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const { data: userInfo, isLoading } = useUserInfo();

  const handleLogin = () => {
    login({ userName: 'admin', password: '123456' }, {
      onSuccess: (data) => {
        // 登录成功后的处理
      }
    });
  };

  return <button onClick={handleLogin} disabled={isPending}>登录</button>;
}
```

**分层优势**

这种分层架构设计带来了诸多优势：

1. **职责清晰**: 每一层都有明确的职责，易于理解和维护
2. **类型安全**: 完整的 TypeScript 类型支持，从 API 到 UI 全链路类型安全
3. **易于测试**: 各层独立，便于单元测试和集成测试
4. **高度复用**: Hooks 封装后可在多个组件中复用
5. **统一管理**: Keys 集中管理，避免缓存 key 冲突
6. **代码规范**: 强制规范的代码组织方式，团队协作更高效

### 📡 HTTP 请求

- **Axios 封装**: 完善的请求拦截和响应处理
- **错误处理**: 统一的错误处理机制
- **Token 刷新**: 自动 Token 刷新机制
- **请求取消**: 支持请求取消和重复请求过滤

### 🎭 组件库

项目内置了丰富的业务组件：

- **SystemLogo**: 系统 Logo 组件
- **ButtonIcon**: 图标按钮组件
- **SvgIcon**: SVG 图标组件
- **DarkModeContainer**: 暗黑模式容器
- **FullScreen**: 全屏切换组件
- **BetterScroll**: 增强滚动组件
- **ErrorBoundary**: 错误边界组件
- **NumberTicker**: 数字滚动动画
- **TypingAnimation**: 打字机动画
- **WaveBg**: 波浪背景动画
- 以及更多...

### 🛠️ 开发工具

- **ESLint**: 代码质量检查
- **TypeScript**: 完整的类型检查
- **Git Hooks**: 提交前自动检查
- **Conventional Commits**: 规范的提交信息
- **CLI 工具**: 内置命令行工具集
- **Vite Inspector**: 开发调试工具


## 浏览器支持

推荐使用最新版的 Chrome 浏览器进行开发，以获得更好的体验。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) |
| --- | --- | --- | --- | --- |
| last 2 versions | last 2 versions | last 2 versions | last 2 versions |