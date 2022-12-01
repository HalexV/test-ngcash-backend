FROM node:16-alpine

WORKDIR /usr/app

COPY ./__tests__/e2e/ ./__tests__/e2e/
COPY ./prisma/ ./prisma/
COPY ./src/ ./src/
COPY ./jest-e2e-config.ts  ./jest-e2e-config.ts
COPY ./jest.config.ts  ./jest.config.ts
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json

RUN chown -R node:node /usr/app

USER node

RUN npm pkg delete scripts.prepare

RUN npm ci

CMD npm run test:e2e
