import { renewToken } from '@/libs/cognito'
import { publicParser } from '@/libs/lambda'
import { formatResponse } from '@libs/api-gateway'

const main = async (event) => {
    const { refreshToken } = event?.body

    if (!refreshToken) {
        return formatResponse(400, {
            err: `Refresh Token requerido`,
        })
    }

    const res = await renewToken({ refreshToken })

    if (res?.status) {
        return formatResponse(200, {
            message: `Token renovado`,
            accessToken: res?.accessToken,
            identityToken: res?.identityToken,
        })
    } else {
        return formatResponse(500, {
            err: res?.err
        })
    }
}

export const handler = publicParser(main)
