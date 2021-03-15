const { model, Schema } = require('mongoose')

const Role = new Schema({
    name: String
})

module.exports = model('Role', Role)
