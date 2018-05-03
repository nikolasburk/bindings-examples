const { makeBinding } = require('graphql-binding')

const { schema } = require('../../../post-service/src/schema')

const Binding = makeBinding(schema) // makes the class

module.exports = {
  postBinding: new Binding(),
}
