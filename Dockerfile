FROM node:14.17-alpine3.13

WORKDIR /usr/src/whatsapprest
COPY . .
RUN npm install

CMD ["/bin/sh"]