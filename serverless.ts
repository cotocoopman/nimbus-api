import type { AWS } from '@serverless/typescript'
import functions from '@resources/functions'
import cognito from '@resources/cognito'

const serverlessConfiguration: AWS = {
  service: 'serverless-template-ts',
  frameworkVersion: '3',
  configValidationMode: 'error',
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'us-east-1',
    profile: 'serverless-user',
    // memorySize: 512,
    // stage: `${opt:stage, 'dev'}`,
    // timeout: 30,
    logRetentionInDays: 30,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'lambda:InvokeFunction',
              'cognito-idp:CreateUserPool',
              'cognito-idp:CreateUserPoolClient',
              'cognito-idp:DeleteUserPool',
              'cognito-idp:DeleteUserPoolClient',

              // 'dynamodb:DescribeTable',
              // 'dynamodb:Query',
              // 'dynamodb:Scan',
              // 'dynamodb:GetItem',
              // 'dynamodb:PutItem',
              // 'dynamodb:UpdateItem',
              // 'dynamodb:DeleteItem',
              // 'cognito-idp:AdminInitiateAuth',
              // 'cognito-idp:AdminCreateUser',
              // 'cognito-idp:AdminSetUserPassword',
              // 'cognito-idp:AdminConfirmSignUp',
              // 'cognito-idp:ListUsers',
            ],
            Resource: "*",
          }
        ]
      }
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      // COGNITO_USER_POOL: `${ self: custom.cognito.userPool }`,
      // COGNITO_USER_POOL: `${ self: custom.cognito.userPool }`,
      // COGNITO_USER_POOL_ID: ${ self: custom.cognito.userPoolId },
      // COGNITO_APP_CLIENT_ID: ${ self: custom.cognito.appClientId },
      // COGNITO_APP_CLIENT_NAME: ${ self: custom.cognito.appClientName },
      // SECRET_ENCRYPT_KEY: ${ self: custom.secretEncryptKey },
      // NODE_ENV_SLS: ${ env: NODE_ENV, 'development'},
    },
  },
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-dotenv-plugin',
    'serverless-plugin-common-excludes',
    'serverless-middleware',
  ],
  package: { individually: true },
  // resources:
  // - ${file(./resources/cognito.yml)}
  // - ${file(./resources/dynamodb.yml)}
  custom: {
    // tablesNames: ${file(./constants/db.js)}
    // secretEncryptKey: 4lm4c3n1f1_2023
    // cognito:
    //   userPool: ${self:provider.stage}-bodega-usuarios
    //   userPoolId: us-east-1_yez2URbWG
    //   appClientId: 16nkfr3pr201seqob9u0mffo9b
    //   appClientName: ${self:provider.stage}-bodega-usuarios-app-client
    //   verificationMessage: "Verifique su dirección de correo electrónico pulsando el siguiente enlace: http://localhost:3000/activate?email={email}&code={##VerifyEmail.Link##}"
    //   verificationSubject: "Verifique tu cuenta de correo"

    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  functions,
  resources: {
    ...cognito
  }
}

module.exports = serverlessConfiguration