import { confirmForgotPassword } from '@/libs/cognito'
import { publicParser } from '@/libs/lambda'
import { isEmailValid } from '@/utils/helpers'
import { formatResponse } from '@libs/api-gateway'

const main = async (event) => {
    const { email, confirmationCode, password } = event?.body

    if (!isEmailValid(email)) {
        return formatResponse(400, {
            err: `Correo inválido`,
        })
    }

    if (!confirmationCode) {
        return formatResponse(400, {
            err: `Se necesita el código de verificación`,
        })
    }

    if (!password) {
        return formatResponse(400, {
            err: `Se requiere una contraseña nueva`,
        })
    }

    const res = await confirmForgotPassword({ email, confirmationCode, password })

    if (res?.status) {
        return formatResponse(200, {
            message: `Contraseña modificada correctamente`,
        })
    } else {
        return formatResponse(401, {
            err: res?.err
        })
    }
}

export const handler = publicParser(main)
