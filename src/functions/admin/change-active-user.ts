import { COMMON_DISABLE_USER, COMMON_ENABLE_USER } from '@/constants/common'
import { disableUser, enableUser } from '@/libs/cognito'
import { publicParser } from '@/libs/lambda'
import { formatResponse } from '@libs/api-gateway'

const main = async (event) => {
    const { type } = event?.pathParameters
    const { sub } = event?.body

    if (![COMMON_ENABLE_USER, COMMON_DISABLE_USER].includes(type)) {
        return formatResponse(400, {
            err: 'Tipo inválido'
        })
    }

    if (!sub) {
        return formatResponse(400, {
            err: 'Usuario no especificado'
        })
    }

    const res = (type === COMMON_ENABLE_USER) ? await enableUser({ sub }) : await disableUser({ sub })


    if (res?.status) {
        return formatResponse(200, {
            message: `Usuario ${(type === COMMON_ENABLE_USER) ? `habilitado` : `deshabilitado`} correctamente`,
        })
    } else {
        return formatResponse(500, {
            err: res?.err
        })
    }
}

export const handler = publicParser(main)
