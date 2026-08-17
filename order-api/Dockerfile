FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache protobuf

COPY infrastructure /app/infrastructure

COPY order-api/package*.json ./
RUN npm install

COPY order-api/ .

EXPOSE 3000
CMD ["npm", "run", "dev"]