const resource = {
    Resources: {
        CognitoUserPool: {
            Type: 'AWS::Cognito::UserPool',
            Properties: {
                MfaConfiguration: 'OFF',
                UserPoolName: 'dev-nimbus-user-pool',
                UsernameAttributes: [
                    'email',
                ],
                AutoVerifiedAttributes: [
                    'email',
                ],
                Schema: [
                    {
                        AttributeDataType: 'String',
                        Name: 'name',
                        Required: true,
                    },
                    {
                        AttributeDataType: 'String',
                        Name: 'family_name',
                        Required: true,
                    },
                    {
                        AttributeDataType: 'String',
                        Name: 'phone_number',
                        Required: true,
                    },
                    {
                        AttributeDataType: 'String',
                        Name: 'gender',
                        Required: false,
                    },
                    {
                        AttributeDataType: 'String',
                        Name: 'birthdate',
                        Required: false,
                    },
                ],
                // EmailVerificationMessage: 'Verifique su dirección de correo electrónico pulsando el siguiente enlace: http://localhost:3000/activate?email={email}&code={##VerifyEmail.Link##}',
                // EmailVerificationSubject: 'Verifique tu cuenta de correo',
                Policies: {
                    PasswordPolicy: {
                        MinimumLength: 6,
                        RequireLowercase: true,
                        RequireUppercase: true,
                        RequireNumbers: true,
                        RequireSymbols: false,
                    }
                }
            }
        },
        CognitoUserPoolClient: {
            Type: 'AWS::Cognito::UserPoolClient',
            Properties: {
                ClientName: 'dev-nimbus-user-app-client',
                GenerateSecret: false,
                UserPoolId: {
                    Ref: 'CognitoUserPool',
                },
                ExplicitAuthFlows: [
                    'ALLOW_USER_SRP_AUTH',
                    'ALLOW_ADMIN_USER_PASSWORD_AUTH',
                    'ALLOW_CUSTOM_AUTH',
                    'ALLOW_REFRESH_TOKEN_AUTH'
                ]
            }
        },
        ApiGatewayAuthorizer: {
            Type: 'AWS::ApiGateway::Authorizer',
            Properties: {
                Name: 'CognitoAuth',
                Type: 'COGNITO_USER_POOLS',
                IdentitySource: 'method.request.header.Authorization',
                RestApiId: {
                    Ref: 'ApiGatewayRestApi',
                },
                ProviderARNs: [{
                    'Fn::GetAtt': ['CognitoUserPool', 'Arn']
                }]
            }
        }
    }
}

export default resource