FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

# Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Build
FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production image
FROM base AS runner
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

RUN mkdir -p logs && chown -R node:node /app
USER node

EXPOSE 4000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]