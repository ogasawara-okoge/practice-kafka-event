FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache protobuf
COPY infrastructure /infrastructure
COPY order-processor/package*.json ./
RUN npm install
COPY order-processor/ .
CMD ["npm", "run", "dev"]