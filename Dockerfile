FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev
RUN npx drizzle-kit push

COPY . .

EXPOSE 4001

CMD ["node", "index.js"]