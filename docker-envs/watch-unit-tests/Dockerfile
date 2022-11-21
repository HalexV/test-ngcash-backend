FROM node:16-alpine

WORKDIR /usr/app

COPY ./__tests__/unit/ ./__tests__/unit/
COPY ./.jest/ ./.jest/
COPY ./prisma/ ./prisma/
COPY ./src/ ./src/
COPY ./jest-unit-config.ts  ./jest-unit-config.ts
COPY ./jest.config.ts  ./jest.config.ts
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json

RUN npm ci

USER node

CMD npm run test:unit
