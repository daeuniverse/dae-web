# 多步骤构建

# 构建步骤
FROM node as builder

WORKDIR /build
ENV HUSKY=0

COPY . .

# corepack 安装包管理 pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# 安装依赖
RUN pnpm install
# 构建
RUN pnpm build

# 运行步骤
FROM node as runner

WORKDIR /app

COPY --from=builder /build/.output .

# nodejs 执行入口文件，启动服务
CMD ["node", "./server/index.mjs"]