FROM node:12.18.3

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY commands commands
COPY bot.js bot.js

RUN npm install

CMD [ "node", "bot.js" ]