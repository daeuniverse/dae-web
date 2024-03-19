FROM oven/bun:1 as builder

WORKDIR /build
ENV HUSKY=0

COPY . .

RUN bun install
RUN bun run build

FROM oven/bun:1 as runner

WORKDIR /app

COPY --from=builder /build/.output .

CMD ["bun", "./.output/server/index.mjs"]