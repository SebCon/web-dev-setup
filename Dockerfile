# base image
FROM node:alpine

LABEL author="Sebastian Conrad"
LABEL email="info@sebcon.de"
LABEL version="1.0"
LABEL description="web development container"

# source code to docker
RUN mkdir -p /usr/src/app 
COPY . /usr/src/app 
WORKDIR /usr/src/app

# install
RUN npm install
RUN npm install typescript

# port listener
EXPOSE 9000

#run
CMD ["node"]