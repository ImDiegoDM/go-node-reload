FROM golang:1.11

WORKDIR /

RUN apt-get update
RUN apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash

RUN apt-get -y install nodejs

COPY package.json package.json
COPY gulpfile.js gulpfile.js

RUN npm install
