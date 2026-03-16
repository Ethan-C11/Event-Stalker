FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY drizzle.config.js ./

RUN npm install
COPY . .

FROM node:20-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app .

RUN npm prune --omit=dev

EXPOSE 4001

CMD ["sh", "-c", "npx drizzle-kit push && node index.js"]