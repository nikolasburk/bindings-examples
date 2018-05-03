const { makeBinding } = require('graphql-binding')
const schema = require('../../post-service/src/schema')

module.exports = makeBinding(schema)
