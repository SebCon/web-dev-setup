# base image
FROM ubuntu:14.04

LABEL author="Sebastian Conrad"
LABEL email="info@sebcon.de"
LABEL version="1.0"
LABEL description="web development container"

# source code to docker
RUN mkdir -p /usr/src/app 
COPY . /usr/src/app 
WORKDIR /usr/src/app

# install
RUN cd /usr/src/app
RUN apt-get update
RUN apt-get -qq update
RUN apt-get install -y nodejs npm
RUN ap-get install nano
RUN npm install

# port listener
EXPOSE 9000

#run
CMD ["gulp"]