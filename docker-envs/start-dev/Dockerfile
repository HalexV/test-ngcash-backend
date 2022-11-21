FROM node:16-alpine

WORKDIR /usr/app

RUN chown node:node /usr/app

COPY ./prisma/ ./prisma/
COPY ./src/ ./src/
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json

USER node

RUN npm ci

CMD npm run start:dev
