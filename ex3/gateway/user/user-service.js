import { makeBinding } from 'graphql-binding'
import schema from  '../user-service/src/index'

export const Binding = makeBinding(schema) // makes the class

module.exports = {
  userBinding: new Binding()
}