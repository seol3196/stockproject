FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --production --no-optional

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
