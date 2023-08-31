FROM node:16.20.1-buster

WORKDIR /app
EXPOSE 3333

COPY node_modules /app/node_modules/
COPY package*.json /app/
COPY .sequelizerc /app/
COPY dist /app/dist/

CMD ["npm", "start"]
