FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache protobuf
COPY infrastructure /infrastructure
COPY mail-service/package*.json ./
RUN npm install
COPY mail-service/ .
CMD ["npm", "run", "dev"]

