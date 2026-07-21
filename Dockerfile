FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN corepack prepare pnpm@8.15.6 --activate
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["node", "dist/server.js"]