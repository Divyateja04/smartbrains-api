FROM node:carbon

WORKDIR /usr/src/smartbrain-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]