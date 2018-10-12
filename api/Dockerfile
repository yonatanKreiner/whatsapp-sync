FROM node
WORKDIR /code
COPY . .
ENV PORT=80 BACKEND="whatsappsync-backend.eastus.azurecontainer.io:8080" REDIRECT="http://whatsappsync.eastus.azurecontainer.io/authorized"
EXPOSE 80
RUN npm i --production
CMD ["node", "index.js"]
