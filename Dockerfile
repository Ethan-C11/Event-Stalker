FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4001

CMD ["sh", "-c", "npx drizzle-kit push && node index.js"]