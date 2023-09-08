import { formatResponse } from '@libs/api-gateway'
import { authParser, publicParser } from '@libs/lambda'

const example = async (event) => {
  if (event.body) {
    return formatResponse(200, {
      message: `POST Hello ${event.body.name}, welcome to the exciting Serverless world!`,
      event,
    })
  } else {
    return formatResponse(500, {
      message: `GET Hello, welcome to the exciting Serverless world!`,
      event,
    })
  }
}

// PARA METODOS PUBLICOS
// export const main = publicParser(hello)

// PARA METODOS PRIVADOS CON AUTHENTICATION PROPIA
export const main = authParser(example)

// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
// import { formatResponse } from '@libs/api-gateway'
// import { middyfy, auth } from '@libs/lambda'

// import schema from './schema'

// const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
//   console.log("hello")
//   if (event.body) {
//     return formatResponse(200, {
//       message: `POST Hello ${event.body.name}, welcome to the exciting Serverless world!`,
//       event,
//     })
//   } else {
//     return formatResponse(500, {
//       message: `GET Hello, welcome to the exciting Serverless world!`,
//       event,
//     })
//   }
// }

// // export const main = middyfy(hello)
// export const main = auth(hello)