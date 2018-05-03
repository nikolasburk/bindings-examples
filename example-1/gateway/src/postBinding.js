const { makeBindingClass } = require('graphql-binding')
const schema = require('../../post-service/src/schema')

module.exports = makeBindingClass(schema)
