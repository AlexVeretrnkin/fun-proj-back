FROM node:12-alpine AS builder

WORKDIR /app

COPY ./package.json ./

RUN apk add --no-cache chromium git

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

ENV CHROMIUM_PATH /usr/bin/chromium-browser

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
