# ---- Build stage ----
FROM node:20 AS builder

WORKDIR /app

# Copy server configs and dependencies
COPY server/package*.json server/tsconfig.json ./
RUN npm ci

# Copy server source code only
COPY server ./

# Compile TS → dist/
RUN npm run build

# ---- Runtime stage ----
FROM node:20-slim AS runtime

WORKDIR /app

# Install only production dependencies
COPY server/package*.json ./
RUN npm ci --omit=dev

# Copy compiled JS from builder
COPY --from=builder /app/dist ./dist

# ---- Accept required build args ----
ARG NODE_ENVIRONMENT

# ---- Expose them as runtime env vars ----
ENV NODE_ENVIRONMENT=$NODE_ENVIRONMENT

EXPOSE 3003

CMD ["node", "dist/index.js"]
