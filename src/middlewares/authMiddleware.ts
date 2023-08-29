import { formatResponse } from '@libs/api-gateway'
import { MiddlewareObj } from '@middy/core'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const authMiddleware: MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> = {
    before: (handler) => {
        // LOGICA DE VALIDACION DE TOKEN
        const { Authorization } = handler.event.headers
        const authorized = (Authorization) ? true : false
        
        if (!authorized) {
            return formatResponse(401, { message: 'Unauthorized' })
        }
        return
    },
}

export default authMiddleware
