FROM node:16-alpine

WORKDIR /usr/app

COPY ./prisma/ ./prisma/
COPY ./dist/ ./src/
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN chown -R node:node /usr/app

USER node

RUN npm pkg delete scripts.prepare
RUN npm ci --omit=dev

CMD npm run start:prod
