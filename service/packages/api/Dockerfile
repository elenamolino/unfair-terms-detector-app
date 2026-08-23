FROM node:22-slim AS base
WORKDIR /app

# Copy workspace manifests first for better layer caching
COPY package.json ./
COPY packages/core/package.json ./packages/core/package.json
COPY packages/api/package.json ./packages/api/package.json

RUN npm install --workspace packages/core --workspace packages/api --omit=dev

# Copy source
COPY packages/core/src ./packages/core/src
COPY packages/api/src ./packages/api/src

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

RUN useradd --uid 1001 --create-home appuser \
    && chown -R appuser:appuser /app
USER appuser

CMD ["node", "packages/api/src/server.js"]
