FROM node:alpine

WORKDIR /client
COPY package.json .
RUN npm install --only=prod
COPY . . 

CMD ["npm","run","dev"]