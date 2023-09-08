const CryptoJS = require("crypto-js")

/**
 * 
 * @param {string} password contraseña sin encriptar
 * 
 * @returns {object} { status: boolean, password: string }
 */
const encryptPassword = (password: string) => {
    if (!password) {
        return {
            status: false,
            err: 'No se ha enviado una contraseña válida',
        }
    }

    const encrypt_password = CryptoJS.AES.encrypt(password, process.env.SECRET_ENCRYPT_KEY).toString()

    return {
        status: true,
        password: encrypt_password
    }
}

/**
 *
 * @param {string} password contraseña encriptada CryptoJS
 *
 * @returns {object} { status: boolean, password: string }
 */
const decryptPassword = (password: string) => {
    if (!password) {
        return {
            status: false,
            err: 'No se ha enviado una contraseña válida',
        }
    }

    const bytes = CryptoJS.AES.decrypt(password, process.env.SECRET_ENCRYPT_KEY)
    const decrypt_password = bytes.toString(CryptoJS.enc.Utf8)

    return {
        status: true,
        password: decrypt_password
    }
}

/**
 *
 * @param {string} phone número de teléfono sin formato unificado
 *
 * @returns {object} { status: boolean, formatPhoneNumber: string }
 */
const formatPhoneNumber = (phone: string) => {
    if (!phone) {
        return phone
    }

    let formatPhoneNumber = phone.replaceAll(' ', '')
    formatPhoneNumber = (formatPhoneNumber.indexOf('+') < 0) ? `+${formatPhoneNumber}` : formatPhoneNumber

    return formatPhoneNumber
}

/**
 *
 * @param {string} email email para validar formato
 *
 * @returns {boolean}
 */
const isEmailValid = (email: string) => {
    const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    return (validEmail.test(email)) ? true : false
}

export {
    encryptPassword,
    decryptPassword,
    formatPhoneNumber,
    isEmailValid,
}