FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./

RUN apk add --no-cache bash

RUN yarn

COPY . .

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD docker
ENV POSTGRES_DB warren_db

EXPOSE 3333

