## Description

This is a test assignment, the detailed requirements for which can be found below. Its essence is to create two microservices: 

1) HTTP API for user registration 
2) sending push-notifications after 24 hours from the moment of user creation.

To simulate a push-notification there is a fake call to the provided URL. The RabbitMQ plugin [rabbitmq-delayed-message-exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/) was used to implement delayed push notification. Its analogs can be a cron job or the concept of expiring keys in Redis.

Technologies used: NestJS, PostgreSQL, RabbitMQ, Docker.

## Requirements

https://sites.google.com/gen.tech/nodejs-developer/home

## Installation

Clone the repository:

```bash
git clone https://github.com/pavlokolodka/obrio-test-task.git .
```

Create .env files:

```bash
cp ./user-service/.env.example ./user-service/.env
```

```bash
cp ./notification-service/.env.example ./notification-service/.env
```

Adjust the configuration:

1. ./notification-service/.env:

WEBHOOK_URL - your webhoook url, e.g. `https://webhook.site/`

2. ./user-service/.env

DELAY_IN_MILLISECONDS - for testing purposes, you can shorten the time it takes to send push notifications.

## Running the app

```bash
docker compose up
```

## Test

```bash
curl --location 'localhost:3000/users' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Bob"
}'
```

