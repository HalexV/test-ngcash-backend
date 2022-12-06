FROM node:16-alpine

WORKDIR /usr/app

COPY ./__tests__/ ./__tests__/
COPY ./coverage/ ./coverage/
COPY ./.jest/ ./.jest/
COPY ./prisma/ ./prisma/
COPY ./src/ ./src/
COPY ./jest-coverage-config.ts  ./jest-coverage-config.ts
COPY ./jest.config.ts  ./jest.config.ts
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json

RUN chown -R node:node /usr/app

USER node

RUN npm pkg delete scripts.prepare

RUN npm ci

CMD npm run test:coverage
