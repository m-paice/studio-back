FROM node:12.2.0-alpine as production 
#also say 
WORKDIR /app
#copy the back app to the container
COPY . /app/ 
COPY .sequelizerc /app/

#prepare the container for building back 
RUN npm install --silent
RUN npm run build 

EXPOSE 3333
CMD [ "npm", "start" ]