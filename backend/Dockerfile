FROM node:24.8.0

# Creates and sets the working directory inside the 
# container to /express-app
WORKDIR /express-app  

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]