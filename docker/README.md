# fastapiReactadmin 部署说明

> **与仓库根文档的关系**：项目总览、快速开始、演示账号等请以 [根目录 README.md](../README.md) 为准；**本文档**侧重 Docker 部署的详细操作。

## 项目结构

```
docker/
├── backend/                # 后端服务配置
│   └── Dockerfile          # 后端 Dockerfile（多阶段构建）
├── nginx/                  # Nginx 配置
│   ├── nginx.conf          # Nginx 配置文件
│   ├── ssl/                # SSL 证书目录（需自行放置证书文件）
│   │   └── .gitkeep        # 保留目录结构
│   ├── web/                # 前端静态文件（放置 dist/ 后部署）
│   │   └── .gitkeep
├── mysql/                  # MySQL 持久化目录
│   └── .gitkeep            # 容器运行后自动产生数据文件
├── redis/                  # Redis 持久化目录
│   └── .gitkeep            # 容器运行后自动产生数据文件
├── docker-compose.yaml     # Docker Compose 编排文件
├── .env                    # 环境变量配置文件（.gitignore 已排除）
├── .env.example            # 环境变量示例文件
├── env.sh                  # 环境变量加载脚本
└── README.md               # 本文档
```

> `.gitkeep` 仅用于保留空目录结构，不包含任何实际内容。

## 部署准备

### 系统依赖

- Docker (>= 20.10)
- Docker Compose (v2，Docker 内置的 `docker compose` 命令)

### 环境配置

1. **配置环境变量**

   ```bash
   cp .env.example .env
   chmod 600 .env  # 限制权限，防止其他用户读取密码
   ```

   主要配置项：

   | 变量 | 说明 |
   |------|------|
   | `MYSQL_ROOT_PASSWORD` | MySQL 根密码 |
   | `MYSQL_DATABASE` | 数据库名 |
   | `MYSQL_USER` | 数据库用户 |
   | `MYSQL_PASSWORD` | 数据库密码 |
   | `REDIS_PASSWORD` | Redis 密码 |
   | `BACKEND_PORT` | 后端服务端口 |
   | `HTTP_PORT` | HTTP 端口 |
   | `HTTPS_PORT` | HTTPS 端口 |

2. **SSL 证书配置**（可选，但生产环境必须）

   将 SSL 证书文件放在 `nginx/ssl/` 目录下：

   ```bash
   # 自签名证书（测试用）：
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout docker/nginx/ssl/server.key \
     -out docker/nginx/ssl/server.pem \
     -subj "/CN=reckt.fastapireactadmin.com"

   # 生产环境请使用正规 CA 签发的证书
   ```

## 部署方式

### 方式一：使用部署脚本（推荐）

在项目根目录执行：

```bash
# 注意，默认跳过了前端构建，需要本地将前端构建dist放在docker目录下的nginx目录web目录下
./deploy.sh

# 完整部署，构建前端
./deploy.sh --build-frontend
```

脚本会自动执行：检查依赖 → 创建目录 → 停止旧容器 → 更新代码 → 构建镜像 → 启动容器 → 验证部署 → 清理旧资源。

**命令选项**

| 命令 | 说明 |
|------|------|
| `./deploy.sh` | 完整部署流程 |
| `./deploy.sh start` | 启动所有容器 |
| `./deploy.sh stop` | 停止所有容器 |
| `./deploy.sh restart` | 重启所有容器 |
| `./deploy.sh logs` | 查看所有容器日志 |
| `./deploy.sh verify` | 验证部署状态 |
| `./deploy.sh clean` | 清理旧镜像 |
| `./deploy.sh --build-frontend` | 完整部署并构建前端 |
| `./deploy.sh --skip-frontend` | 完整部署并跳过前端构建（默认） |

### 方式二：手动操作

```bash
cd docker

# 启动所有服务
docker compose --env-file .env up -d

# 查看状态
docker compose ps

# 查看日志
docker compose logs -f [service_name]

# 停止服务
docker compose down

# 仅重建某个服务
docker compose up -d --no-deps --build [service_name]
```

## 容器资源限制

| 服务 | CPU 限制 | 内存限制 | 内存预留 |
|------|----------|----------|----------|
| MySQL | 无限制 | 1 GB | 256 MB |
| Redis | 无限制 | 512 MB | 128 MB |
| Backend | 1 核 | 1 GB | 256 MB |
| Nginx | 0.5 核 | 256 MB | 64 MB |

如需调整，修改 `docker-compose.yaml` 中对应服务的 `deploy.resources` 字段。

## 访问信息

部署完成后，可以通过以下地址访问：

| 服务 | 地址 |
|------|------|
| 前端 | `https://域名(或 ip)/web` |
| API 文档 | `https://域名(或 ip)/api/v1/docs` |
| 登录信息 | 账号 `admin`，密码 `123456` |

> **注意**: `docs` 和 `app` 目录默认不参与部署，如需启用请取消 docker-compose.yaml 中相关配置注释。

## 日志管理

```bash
# 查看所有容器日志
./deploy.sh logs

# 查看实时日志
cd docker
docker compose logs -f [服务名]

# 服务名：backend, nginx, mysql, redis
```

各容器的日志会被 Docker 自动轮转，限制为每个容器最多保留 3 个日志文件，每个最大 10MB。可在 `docker-compose.yaml` 中调整 `logging` 配置。

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| 环境变量文件不存在 | 部署脚本会自动从 `.env.example` 创建，或手动 `cp docker/.env.example docker/.env` |
| 前端构建失败 | 建议在本地构建前端，将 `dist` 目录上传到 `docker/nginx/` 对应目录 |
| 容器启动失败 | `cd docker && docker compose logs [服务名]` 查看具体错误 |
| 数据库连接失败 | 确保 `.env` 中数据库配置正确，MySQL 容器正常运行 |
| 端口冲突 | 修改 `.env` 中的端口配置，重新部署 |
| MySQL 数据目录权限问题 | `sudo chown -R 999:999 docker/mysql/data && sudo chmod -R 755 docker/mysql/data` |

## 安全建议

1. **修改默认密码**：部署后请修改 `.env` 中的密码
2. **保护 `.env` 文件**：已加入 `.gitignore`，请勿手动提交
3. **使用正规 SSL 证书**：生产中不要使用自签名证书
4. **限制端口访问**：通过防火墙只开放 80/443 端口
5. **及时更新**：定期执行部署脚本获取最新版本

## 版本更新

```bash
./deploy.sh    # 用途：自动拉取最新代码 → 构建新镜像 → 重启容器
```
