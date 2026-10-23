FROM oven/bun:1.4.4-slim

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY server.ts ./
COPY models/ /app/models/

EXPOSE 8200

CMD ["bun", "run", "server.ts"]