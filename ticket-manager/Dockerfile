FROM node:22-alpine AS frontend

WORKDIR /frontend

COPY ticket-manager/package*.json ./

RUN npm install

COPY ticket-manager .

RUN npm run build