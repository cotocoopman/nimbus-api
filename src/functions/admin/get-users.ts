import { listUsers } from '@/libs/cognito'
import { publicParser } from '@/libs/lambda'
import { formatResponse } from '@libs/api-gateway'

const main = async (event) => {
    const params = event?.queryStringParameters

    let sub: string = (params?.sub) ? params?.sub : null
    let email: string = (params?.email) ? params?.email : null
    let name: string = (params?.name) ? params?.name : null
    let family_name: string = (params?.family_name) ? params?.family_name : null

    const res = await listUsers({ sub, email, name, family_name })

    if (res?.status) {
        return formatResponse(200, {
            message: `Usuarios obtenidos`,
            users: res?.users,
        })
    } else {
        return formatResponse(500, {
            err: res?.err
        })
    }
}

export const handler = publicParser(main)
