import { signIn } from '@/libs/cognito'
import { publicParser } from '@/libs/lambda'
import { isEmailValid } from '@/utils/helpers'
import { formatResponse } from '@libs/api-gateway'

const main = async (event) => {
    const {
        email,
        password,
        rememberMe = false
    } = event?.body

    if (!isEmailValid(email)) {
        return formatResponse(400, {
            err: `Correo inválido`,
        })
    }

    if (!password) {
        return formatResponse(400, {
            err: `Contraseña inválida`,
        })
    }

    const res = await signIn({ email, password, rememberMe })

    if (res?.status) {
        return formatResponse(200, {
            message: `Sesión iniciada`,
            user: res?.user,
            token: res?.token,
        })
    } else {
        return formatResponse(401, {
            err: res?.err
        })
    }
}

export const handler = publicParser(main)
