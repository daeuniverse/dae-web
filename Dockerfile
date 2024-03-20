FROM node as builder

WORKDIR /build
ENV HUSKY=0

COPY . .

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

RUN pnpm install
RUN pnpm build

FROM node as runner

WORKDIR /app

COPY --from=builder /build/.output .

CMD ["node", "./server/index.mjs"]