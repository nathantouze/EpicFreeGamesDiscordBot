FROM node:21-alpine3.18

WORKDIR /app

ADD * ./

RUN npm install