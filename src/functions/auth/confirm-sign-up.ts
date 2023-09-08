import { confirmSignUp } from '@/libs/cognito'
import { publicParser } from '@/libs/lambda'
import { isEmailValid } from '@/utils/helpers'
import { formatResponse } from '@libs/api-gateway'

const main = async (event) => {
    const { email, verificationCode } = event?.body

    if (!isEmailValid(email)) {
        return formatResponse(400, {
            err: `Correo inválido`,
        })
    }

    if (!verificationCode) {
        return formatResponse(400, {
            err: `Ingresa el código de verificación`,
        })
    }

    const res = await confirmSignUp({ email, verificationCode: verificationCode.toString() })

    if (res?.status) {
        return formatResponse(200, {
            message: `Correo '${email}' verificado!`,
        })
    } else {
        return formatResponse(500, {
            err: res?.err
        })
    }
}

export const handler = publicParser(main)
