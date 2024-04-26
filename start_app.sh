#!/bin/bash

# Change directory to where your package.json is located
cd 8sbot

# Retrieve Parameter Store values directly in the deployment script
BOT_TOKEN=$(aws ssm get-parameter --name /jr/bot_token --query Parameter.Value --output text)
CLIENT_ID=$(aws ssm get-parameter --name /jr/client_id --query Parameter.Value --output text)
SERVER_ID=$(aws ssm get-parameter --name /jr/server_id --query Parameter.Value --output text)

export BOT_TOKEN
export CLIENT_ID
export SERVER_ID

# Use the retrieved values in your application setup/configuration
echo "Configuring application with BOT_TOKEN=$BOT_TOKEN"

ls

# Run npm install to install dependencies
npm install

node index.js