const functions = {
    hello: {
        handler: 'src/functions/hello/handler.main',
        events: [
            {
                http: {
                    method: 'get',
                    path: '/hello',
                    cors: true,
                },
            },
            {
                http: {
                    method: 'post',
                    path: '/hello',
                    cors: true,
                },
            },
        ],
    },
}

export default functions 