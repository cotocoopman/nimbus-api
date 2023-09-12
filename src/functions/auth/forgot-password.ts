import { forgotPassword } from '@/libs/cognito'
import { publicParser } from '@/libs/lambda'
import { isEmailValid } from '@/utils/helpers'
import { formatResponse } from '@libs/api-gateway'

const main = async (event) => {
    const { email } = event?.body

    if (!isEmailValid(email)) {
        return formatResponse(400, {
            err: `Correo inválido`,
        })
    }

    const res = await forgotPassword({ email })

    if (res?.status) {
        return formatResponse(200, {
            message: `Revisa tu correo para reestablecer tu contraseña`,
        })
    } else {
        return formatResponse(401, {
            err: res?.err
        })
    }
}

export const handler = publicParser(main)
