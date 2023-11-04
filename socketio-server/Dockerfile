FROM node:16-alpine3.15

WORKDIR /usr/src/app

ADD package*.json ./

RUN npm install

ADD . .

CMD npm start