FROM node:21-alpine3.18

WORKDIR /app

COPY . .

RUN apk update && apk add --no-cache dcron

COPY cron/daily /etc/cron.d/daily

RUN touch /var/log/cron.log

RUN crontab /etc/cron.d/daily

RUN npm install

CMD crond -f -l 2 && tail -f /var/log/cron.log