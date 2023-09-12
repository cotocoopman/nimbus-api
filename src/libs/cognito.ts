import { formatPhoneNumber } from "@/utils/helpers"
const AWS = require('aws-sdk')
const COGNITO = new AWS.CognitoIdentityServiceProvider()
require('aws-sdk/lib/maintenance_mode_message').suppress = true

/**
 * Recuperar el User Pool de Cognito
 * 
 * @returns {object} { status: boolean, userPool: object }
 */
const getUserPool = async () => {
    try {
        const res = await COGNITO.listUserPools({ MaxResults: 1 }).promise()

        return {
            status: true,
            userPool: res.UserPools.find((e: any) => e?.Name === process?.env?.COGNITO_USER_POOL_NAME),
        }
    } catch (err) {
        return {
            status: false,
            err,
        }
    }
}

/**
 * Recuperar el User Pool Client de Cognito
 * 
 * @returns {object} { status: boolean, userPool: object }
 */
const getUserPoolClient = async () => {
    const userPool = await getUserPool()

    try {
        const res = await COGNITO.listUserPoolClients({ UserPoolId: userPool?.userPool?.Id }).promise()

        return {
            status: true,
            userPoolClient: res.UserPoolClients.find((e: any) => e?.ClientName === process?.env?.COGNITO_USER_POOL_CLIENT),
        }
    } catch (err) {
        return {
            status: false,
            err,
        }
    }
}

/**
 * Registro de un nuevo usaurio
 * 
 * @param {object} { name: string, lastname: string, phone: string, email: string, password: string }
 *
 * @returns {object} { status: boolean, sub: string }
 */
const signUp = async ({
    name,
    lastname,
    phone,
    email,
    password,
}: {
    name: string,
    lastname: string,
    phone: string,
    email: string,
    password: string,
}) => {
    if (
        !name
        || !lastname
        || !phone
        || !email
        || !password
    ) {
        return {
            status: false,
            err: 'Se requieren todos los parámetros para el registro',
        }
    }

    const userPoolClient = await getUserPoolClient()

    if (userPoolClient) {
        const params: object = {
            ClientId: userPoolClient?.userPoolClient?.ClientId,
            Password: password,
            Username: email,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'name', Value: name },
                { Name: 'family_name', Value: lastname },
                { Name: 'phone_number', Value: formatPhoneNumber(phone) },
                // { Name: 'gender', Value: gender },
                // { Name: 'birthdate', Value: birthdate },
            ]
        }

        try {
            const user = await COGNITO.signUp(params).promise()

            if (user?.UserSub) {
                return {
                    status: true,
                    user,
                }
            } else {
                return {
                    status: false,
                    err: 'Se requieren parámetros adicionales para el registro',
                }
            }
        } catch (err) {
            let message: any = err
            switch (err?.code) {
                case 'UsernameExistsException':
                    message = 'Este correo ya se encuentra registrado'
                    break
                case 'MissingRequiredParameter':
                    message = 'Se requieren parámetros adicionales para el registro'
                    break
                case 'InvalidParameterException':
                    message = 'Los Parámetros correo o contraseña no son válidos. La contraseña debe tener al menos 6 caracteres, 1 mayúscula y 1 minúscula'
                    break
            }
            return {
                status: false,
                err: message,
            }
        }
    } else {
        return {
            status: false,
            err: 'No se puedo encontrar el UserPoolClient',
        }
    }
}

// /**
//  * Confirma y verifica el registro a través de un código de 6 dígitos
//  * 
//  * @param {object} { email: string, verificationCode: number } 
//  * 
//  * email: email del usuario para verificar 
//  * 
//  * verificationCode: código de 6 dígitos enviado al correo del usuario para verificar. Formato XXXXXX
//  * @returns {object} { status: boolean }
//  */
const confirmSignUp = async ({
    email,
    verificationCode,
}: {
    email: string,
    verificationCode: string,
}) => {
    if (!email || !verificationCode) {
        return {
            status: false,
            err: 'Se requiere un correo y código de verificación válidos',
        }
    }

    const userPoolClient = await getUserPoolClient()

    try {
        const params = {
            ClientId: userPoolClient?.userPoolClient?.ClientId,
            ConfirmationCode: verificationCode,
            Username: email
        }

        await COGNITO.confirmSignUp(params).promise()

        return {
            status: true,
        }
    } catch (err) {
        let message: any = err
        switch (err?.code) {
            case 'UserNotFoundException':
                message = 'Usuario no registrado'
                break
            case 'CodeMismatchException':
                message = 'Código incorrecto'
                break
            case 'NotAuthorizedException':
                message = 'Este correo ya se encuentra verificado'
                break
        }
        return {
            status: false,
            err: message,
        }
    }
}

/**
 * Login para iniciar sesion en Cognito
 * 
 * @param {object} { email: string, password: string, rememberMe: boolean }
 *
 * email: email del usuario
 * 
 * password: contraseña del usuario
 * 
 * rememberMe: permite recordar al usuario
 * @returns {object} { status: boolean, user: object, token: object }
 */
const signIn = async ({
    email,
    password,
    rememberMe = false
}: {
    email: string,
    password: string,
    rememberMe?: boolean
}) => {
    if (!email || !password) {
        return {
            status: false,
            err: 'Se debe ingresar un correo y contraseña',
        }
    }

    const userPoolClient = await getUserPoolClient()
    const userPool = await getUserPool()

    const params = {
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        ClientId: userPoolClient?.userPoolClient?.ClientId,
        UserPoolId: userPool?.userPool?.Id,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            rememberMe: (rememberMe) ? 'YES' : 'NO'
        }
    }

    try {
        const auth = await COGNITO.adminInitiateAuth(params).promise()
        const dataUser = await COGNITO.getUser({ AccessToken: auth?.AuthenticationResult?.AccessToken }).promise()

        let user: any = null
        dataUser.UserAttributes.map((e) => {
            user = {
                ...user,
                [e?.Name]: e?.Value
            }
        })

        return {
            status: true,
            user,
            token: {
                tokenType: auth?.AuthenticationResult?.TokenType,
                accessToken: auth?.AuthenticationResult?.AccessToken,
                identityToken: auth?.AuthenticationResult?.IdToken,
                refreshToken: auth?.AuthenticationResult?.RefreshToken,
            }
        }
    } catch (err) {
        let message: any = err
        switch (err?.code) {
            case 'UserNotFoundException':
                message = 'Usuario no registrado'
                break
            case 'NotAuthorizedException':
                message = (err?.message === 'User is disabled.') ? 'Usuario está deshabilitado' : 'Usuario o contraseña incorrectas'
                break
            case 'MissingRequiredParameter':
                message = 'Se requiere un correo y contraseña válidos'
                break
            case 'InvalidParameterException':
                message = 'Los Parámetros correo o contraseña no son válidos.'
                break
            case 'UserNotConfirmedException':
                message = 'Usuario no verificado.'
                break
        }
        return {
            status: false,
            err: message,
        }
    }
}

/**
 * Verifica y valida el AccessToken
 * 
 * @param {object} { token: string } 
 *
 * token: token jwt de cognito
 * @returns {object} { status: boolean }
 */
const verifyToken = async ({ token }: { token: string }) => {
    if (!token) {
        return {
            status: false,
            err: 'No se ha enviado Token de autentificación',
        }
    }

    try {
        const data = await COGNITO.getUser({ AccessToken: token }).promise()

        if (data.UserAttributes) {
            let user: any = null
            data.UserAttributes.map((e) => {
                user = {
                    ...user,
                    [e?.Name]: e?.Value
                }
            })

            return {
                status: true,
                user
            }
        } else {
            return {
                status: false,
                err: `Token inválido`,
            }
        }
    } catch (err) {
        let message: any = err
        switch (err?.code) {
            case 'NotAuthorizedException':
                message = 'Token inválido'
                break
            case 'UserNotConfirmedException':
                message = 'Usuario no verificado.'
                break
        }
        return {
            status: false,
            err: message,
        }
    }
}

/**
 * Renueva el token a partir del RefreshToken
 * 
 * @param {object} { refreshToken: string } 
 * 
 * refreshToken: token de refresco jwt de cognito
 * @returns {object} { status: boolean, accessToken: string }
 */
const renewToken = async ({ refreshToken }: { refreshToken: string }) => {
    if (!refreshToken) {
        return {
            status: false,
            err: 'No se ha enviado Token de refresco',
        }
    }

    const userPoolClient = await getUserPoolClient()

    const params = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: userPoolClient?.userPoolClient?.ClientId,
        AuthParameters: {
            REFRESH_TOKEN: refreshToken
        }
    }

    try {
        const auth = await COGNITO.initiateAuth(params).promise()

        return {
            status: true,
            accessToken: auth?.AuthenticationResult?.AccessToken,
            identityToken: auth?.AuthenticationResult?.IdToken,
        }
    } catch (err) {
        let message: any = err
        return {
            status: false,
            err: message
        }
    }
}

/**
 * Lista todos los usuarios de Cognito. Se pueden filtrar dependiendo de los valores que se envíen.
 * 
 * @param {object} { sub: string, email: string, family_name: string, name: string } 
 *
 * sub: SUB ID del usuario cognito
 * 
 * email: del usuario cognito
 * 
 * family_name: apellido del usuario cognito
 * 
 * name: nombre del usuario cognito
 * 
 * @returns {object} { status: boolean, users: array }
 */
const listUsers = async ({
    sub,
    email,
    name,
    family_name,
}: {
    sub?: string,
    email?: string,
    name?: string,
    family_name?: string,
}) => {

    let filter: string = ''

    if (sub) {
        filter = ` sub = \"${sub}\"`
    } else {
        if (name) {
            filter += ` name = \"${name}\"`
        }
        if (family_name) {
            filter += ` family_name = \"${family_name}\"`
        }
        if (email) {
            filter += ` email = \"${email}\"`
        }
    }

    const userPool = await getUserPool()

    var params = {
        UserPoolId: userPool?.userPool?.Id,
        Filter: filter,
    }

    try {
        const data = await COGNITO.listUsers(params).promise()

        if (data) {
            let users: any[] = []
            data.Users.map((e: any) => {
                let user: any = null
                e.Attributes.map((att: any) => {
                    user = {
                        ...user,
                        [att?.Name]: att?.Value
                    }
                })
                users.push(user)
            })

            return {
                status: true,
                users
            }
        } else {
            return {
                status: false,
                err: `No se pudo recuperar los usuarios`,
            }
        }
    } catch (err) {
        let message: any = err
        switch (err?.code) {
            case 'NotAuthorizedException':
                message = 'No tiene permisos para listar los Usuarios'
                break
            case 'InvalidParameterException':
                message = 'Parámetros enviados inválidos.'
                break
        }
        return {
            status: false,
            err: message,
        }
    }
}

const disableUser = async ({ sub }: { sub: string }) => {
    if (!sub) {
        return {
            status: false,
            err: `Se debe especificar un usuario`,
        }
    }

    const userPool = await getUserPool()
    var params = {
        UserPoolId: userPool?.userPool?.Id,
        Username: sub
    }

    try {
        await COGNITO.adminDisableUser(params).promise()
        return {
            status: true,
        }
    } catch (err) {
        let message: any = err
        return {
            status: false,
            err: message,
        }
    }
}

const enableUser = async ({ sub }: { sub: string }) => {
    if (!sub) {
        return {
            status: false,
            err: `Se debe especificar un usuario`,
        }
    }

    const userPool = await getUserPool()
    var params = {
        UserPoolId: userPool?.userPool?.Id,
        Username: sub
    }

    try {
        await COGNITO.adminEnableUser(params).promise()
        return {
            status: true,
        }
    } catch (err) {
        let message: any = err
        return {
            status: false,
            err: message,
        }
    }
}

const resendConfirmationCode = async ({ email }: { email: string }) => {
    if (!email) {
        return {
            status: false,
            err: `Se debe especificar un correo`,
        }
    }

    const userPoolClient = await getUserPoolClient()
    var params = {
        ClientId: userPoolClient?.userPoolClient?.ClientId,
        Username: email,
    }

    try {
        await COGNITO.resendConfirmationCode(params).promise()
        return {
            status: true,
        }
    } catch (err) {
        let message: any = err
        return {
            status: false,
            err: message,
        }
    }
}

const forgotPassword = async ({ email }: { email: string }) => {
    if (!email) {
        return {
            status: false,
            err: `Se debe especificar un correo`,
        }
    }

    const userPoolClient = await getUserPoolClient()
    var params = {
        ClientId: userPoolClient?.userPoolClient?.ClientId,
        Username: email,
    }

    try {
        await COGNITO.forgotPassword(params).promise()
        return {
            status: true,
        }
    } catch (err) {
        let message: any = err
        return {
            status: false,
            err: message,
        }
    }
}

const confirmForgotPassword = async ({
    email,
    confirmationCode,
    password,
}: {
    email: string,
    confirmationCode: string,
    password: string,
}) => {
    if (!email) {
        return {
            status: false,
            err: `Se debe especificar un correo`,
        }
    }

    const userPoolClient = await getUserPoolClient()
    var params = {
        ClientId: userPoolClient?.userPoolClient?.ClientId,
        ConfirmationCode: confirmationCode,
        Password: password,
        Username: email,
    }

    try {
        await COGNITO.confirmForgotPassword(params).promise()
        return {
            status: true,
        }
    } catch (err) {
        let message: any = err
        return {
            status: false,
            err: message,
        }
    }
}








// /**
//  * Recupera el SUB ID del usuario Cognito desde los Claims del Token desde el event 
//  * 
//  * @param {object} { event: object } 
//  *
//  * @returns {object} { status: boolean }
//  */
// const getIdByToken = async ({ event }) => {
//     try {
//         const { sub } = event?.requestContext?.authorizer?.claims
//         return {
//             status: true,
//             sub
//         }
//     } catch (err) {
//         return {
//             status: false,
//             err: `No se pudo obtener el SUB ID desde el token`,
//         }
//     }
// }

export {
    getUserPool,
    getUserPoolClient,
    signUp,
    confirmSignUp,
    signIn,
    verifyToken,
    renewToken,
    listUsers,
    disableUser,
    enableUser,
    resendConfirmationCode,
    forgotPassword,
    confirmForgotPassword,
    // getIdByToken,
}