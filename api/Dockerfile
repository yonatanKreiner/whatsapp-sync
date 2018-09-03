FROM node
WORKDIR /code
COPY . .
ENV PORT=80 BACKEND="168.62.172.84:8080" REDIRECT="http://whatsappsync.eastus.azurecontainer.io/authorized"
EXPOSE 80
RUN npm i --production
CMD ["node", "index.js"]
