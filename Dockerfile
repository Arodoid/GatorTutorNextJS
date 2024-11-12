#  This file builds the application container
#  - Multi-stage build for optimization
#  - Different stages for dev/prod
#  - Security hardening (non-root user)
#  Works with docker-compose.yml and .dockerignore

# Base node image
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
RUN npm ci

# Development
FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
EXPOSE 3000

CMD ["npm", "run", "dev"]

# Production builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate

ENV NODE_ENV production
RUN npm run build

# Production runner
FROM base AS production
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
