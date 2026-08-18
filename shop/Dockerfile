FROM node:20-alpine
WORKDIR /app
COPY infrastructure /infrastructure
COPY shop/package*.json ./
RUN npm install
COPY shop/ .
EXPOSE 3001
CMD ["npm", "run", "dev"]