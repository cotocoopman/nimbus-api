import { verifyToken } from '@/libs/cognito'
import { publicParser } from '@/libs/lambda'
import { formatResponse } from '@libs/api-gateway'

const main = async (event) => {
    const { token } = event?.body

    if (!token) {
        return formatResponse(400, {
            err: `Token requerido`,
        })
    }

    const res = await verifyToken({ token })

    if (res?.status) {
        return formatResponse(200, {
            message: `Token válido`,
            user: res?.user,
        })
    } else {
        return formatResponse(401, {
            err: res?.err
        })
    }
}

export const handler = publicParser(main)
