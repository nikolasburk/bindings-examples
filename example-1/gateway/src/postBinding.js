const { Binding } = require('graphql-binding')
const schema = require('../../post-service/src/schema')

class PostBinding extends Binding {

  constructor() {
    super({ schema })
  }

}

module.exports = PostBinding