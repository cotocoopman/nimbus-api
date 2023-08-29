# Serverless - AWS Node.js Typescript

npm install -g serverless
serverless create --template aws-nodejs-typescript
yarn add serverless-offline --save-dev
yarn add serverless-dotenv-plugin --save-dev
yarn add serverless-middleware --save-dev

plugins:
  - serverless-bundle
  - serverless-offline
  - serverless-dotenv-plugin
  - serverless-middleware


serverless-middleware
yarn add serverless-bundle --save-dev



serverless config credentials --provider aws --key AKIARI2O4RSH4LQ3MHPH --secret 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 --profile serverless-user
serverless
npm init -f
serverless invoke local --function hello
