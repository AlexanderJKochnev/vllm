FROM oven/bun:1.1-slim

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY server.ts ./

# Модель скачается при первом запросе в кеш контейнера.
# Если нужен полный офлайн — раскомментируйте COPY models/ и используйте local path.
# COPY models/ /app/models/

EXPOSE 8200

CMD ["bun", "run", "server.ts"]