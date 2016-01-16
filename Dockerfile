FROM nodesource/node:0.12

ADD . .
RUN npm install -g npm
RUN npm run preinstall
RUN npm install
RUN npm run postinstall
RUN npm run prestart

CMD ["npm","start"]
