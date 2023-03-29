FROM node:18-alpine

LABEL MAINTAINER="omoogunolawale@gmail.com"

WORKDIR /app
RUN echo "Created working directory"

COPY package.json ./
RUN echo "Copied package.json"

RUN npm install
RUN echo "Installed node modules"

COPY . .
RUN echo "Copied all files"

EXPOSE 5000
RUN echo "Exposed port 5000"

CMD ["npm", "start"]