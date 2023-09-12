import { COMMON_DEVICE_MOBILE, COMMON_DEVICE_PC } from '@/constants/common'
import { signUp } from '@/libs/cognito'
import { publicParser } from '@/libs/lambda'
import { formatResponse } from '@libs/api-gateway'

const main = async (event) => {
    const {
        name,
        lastname,
        phone,
        email,
        password,
        device,
    } = event?.body

    if (
        !name
        || !lastname
        || !phone
        || !email
        || !password
    ) {
        return formatResponse(400, {
            err: `Parámetros insuficientes`,
        })
    }

    if (
        !device
        || ![COMMON_DEVICE_PC, COMMON_DEVICE_MOBILE].includes(device)
    ) {
        return formatResponse(400, {
            err: `Dispositivo inválido`,
        })
    }

    const res = await signUp({ name, lastname, phone, email, password })

    if (res.status) {
        return formatResponse(200, {
            message: `Hemos registrado tu cuenta!. Por favor verifícala con el código que te enviamos al correo ${email}`,
        })
    } else {
        return formatResponse(500, {
            err: res.err,
        })
    }
}

export const handler = publicParser(main)