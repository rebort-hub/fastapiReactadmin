import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

// 定义默认配置常量
const DEFAULT_QUERY_CONFIG = {
  // 缓存配置 - 10分钟后清理未使用的查询缓存
  gcTime: 10 * 60 * 1000,
  // 网络模式配置
  networkMode: 'online' as const,
  // 组件挂载时如果数据过期则重新获取
  refetchOnMount: true,
  // 网络重连时重新获取
  refetchOnReconnect: true,
  // 窗口聚焦时不自动重新获取（减少不必要的请求）
  refetchOnWindowFocus: false,
  // 失败后重试2次，使用指数退避策略
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  // 组件挂载时如果有错误则重试
  retryOnMount: true,
  // 数据新鲜度配置 - 30秒内数据被视为新鲜，不会重新获取
  staleTime: 30 * 1000
};

const DEFAULT_MUTATION_CONFIG = {
  networkMode: 'online' as const,
  // 变异操作失败后重试1次
  retry: 1,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000)
};

// 创建 QueryClient 实例
export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: DEFAULT_MUTATION_CONFIG,
    queries: DEFAULT_QUERY_CONFIG
  },
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      // 在开发环境中记录错误信息，帮助调试
      if (import.meta.env.DEV) {
        console.error('Mutation error:', error);
      }
      // 在生产环境中，可以将错误发送到错误监控服务（如 Sentry）
    }
  }),
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      // 在开发环境中记录错误信息，帮助调试
      if (import.meta.env.DEV) {
        console.error('Query error:', error);
      }
      // 在生产环境中，可以将错误发送到错误监控服务（如 Sentry）
    }
  })
});
