const API_PATH: string = '/api/v1'

const functions = {
    signUp: {
        handler: 'src/functions/auth/sign-up.handler',
        events: [{
            http: {
                method: 'post',
                path: `${API_PATH}/auth/sign-up`,
                cors: true,
            },
        }],
    },
    confirmSignUp: {
        handler: 'src/functions/auth/confirm-sign-up.handler',
        events: [{
            http: {
                method: 'post',
                path: `${API_PATH}/auth/confirm-sign-up`,
                cors: true,
            },
        }],
    },

    example: {
        handler: 'src/functions/example/handler.main',
        events: [
            {
                http: {
                    method: 'get',
                    path: '/example',
                    cors: true,
                },
            },
            {
                http: {
                    method: 'post',
                    path: '/example',
                    cors: true,
                },
            },
        ],
    },
}

export default functions 