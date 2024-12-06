FROM node:22-alpine

RUN apk update && apk add --no-cache bash curl sqlite

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run generate
RUN npm run migrate
RUN npm run build

EXPOSE 8080

CMD ["node", "run-server.mjs"]
