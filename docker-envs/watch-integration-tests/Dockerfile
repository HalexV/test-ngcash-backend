FROM node:16-alpine

WORKDIR /usr/app

COPY ./__tests__/integration/ ./__tests__/integration/
COPY ./prisma/ ./prisma/
COPY ./src/ ./src/
COPY ./jest-integration-config.ts  ./jest-integration-config.ts
COPY ./jest.config.ts  ./jest.config.ts
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json

RUN chown -R node:node /usr/app

USER node

RUN npm pkg delete scripts.prepare

RUN npm ci

CMD npm run test:integration
