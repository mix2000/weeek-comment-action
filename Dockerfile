FROM node:18

WORKDIR /app

ENV branchName=$branchName
ENV comment=$comment
ENV userMapping=$userMapping
ENV weeekLogin=$weeekLogin
ENV weeekPassword=$weeekPassword
ENV weeekDomain=$weeekDomain
ENV weeekApiDomain=$weeekApiDomain
ENV weeekProjectId=$weeekProjectId


#COPY package*.json ./
#
#RUN npm ci
#
#COPY . .
#
#RUN npm run build
#RUN npm run start

RUN echo $branchName

CMD ["ls"]
