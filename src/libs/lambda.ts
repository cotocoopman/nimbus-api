import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import authMiddleware from "src/middlewares/authMiddleware"

export const publicParser = (handler) => {
  return middy(handler).use(middyJsonBodyParser())
}

export const authParser = (handler) => {
  return middy(handler).use(middyJsonBodyParser()).use(authMiddleware)
}
