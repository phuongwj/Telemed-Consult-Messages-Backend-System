FROM node:24.8.0
WORKDIR /express-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]