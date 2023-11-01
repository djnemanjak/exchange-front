FROM node:14.18-alpine

WORKDIR /var/www/exchange-front

COPY package.json ./

RUN npm install

COPY . ./

CMD ["npm", "start"]