FROM node:22-alpine

RUN apk update && apk add --no-cache sqlite curl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run generate
RUN npm run migrate
RUN npm run build

EXPOSE 8080

CMD ["node", "run-server.mjs"]
