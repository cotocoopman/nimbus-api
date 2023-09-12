const API_PATH: string = '/api/v1'

const functions = {

    /*** AUTH ***/
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
    signIn: {
        handler: 'src/functions/auth/sign-in.handler',
        events: [{
            http: {
                method: 'post',
                path: `${API_PATH}/auth/sign-in`,
                cors: true,
            },
        }],
    },
    verifyToken: {
        handler: 'src/functions/auth/verify-token.handler',
        events: [{
            http: {
                method: 'post',
                path: `${API_PATH}/auth/verify-token`,
                cors: true,
            },
        }],
    },
    refreshToken: {
        handler: 'src/functions/auth/refresh-token.handler',
        events: [{
            http: {
                method: 'put',
                path: `${API_PATH}/auth/refresh-token`,
                cors: true,
            },
        }],
    },
    resendConfirmationCode: {
        handler: 'src/functions/auth/resend-confirmation-code.handler',
        events: [{
            http: {
                method: 'post',
                path: `${API_PATH}/auth/resend-confirmation-code`,
                cors: true,
            },
        }],
    },
    forgotPassword: {
        handler: 'src/functions/auth/forgot-password.handler',
        events: [{
            http: {
                method: 'post',
                path: `${API_PATH}/auth/forgot-password`,
                cors: true,
            },
        }],
    },
    confirmForgotPassword: {
        handler: 'src/functions/auth/confirm-forgot-password.handler',
        events: [{
            http: {
                method: 'post',
                path: `${API_PATH}/auth/confirm-forgot-password`,
                cors: true,
            },
        }],
    },

    /*** ADMIN ***/
    getUsers: {
        handler: 'src/functions/admin/get-users.handler',
        events: [{
            http: {
                method: 'get',
                path: `${API_PATH}/admin/get-users`,
                cors: true,
            },
        }],
    },
    changeActiveUser: {
        handler: 'src/functions/admin/change-active-user.handler',
        events: [{
            http: {
                method: 'put',
                path: `${API_PATH}/admin/change-active-user/{type}`,
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