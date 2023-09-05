# SERVERLESS - AWS Node.js Typescript

npm install -g serverless
serverless create --template aws-nodejs-typescript
yarn add serverless-offline --save-dev
yarn add serverless-dotenv-plugin --save-dev
yarn add serverless-middleware --save-dev

# Add plugins on serverless.ts

plugins:
  - serverless-bundle
  - serverless-offline
  - serverless-dotenv-plugin
  - serverless-middleware

# Test functions

serverless invoke local --function hello

# Yarn to install all dependencies

# COGNITO

On AWS console / Cognito, create a new User Pool and add the required attributes 
