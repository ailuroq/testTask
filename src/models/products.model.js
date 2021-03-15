const { model, Types, Schema } = require('mongoose')

const Products = new Schema({
    name: { type: String, required: true, unique:true },
    price: {type: 'Number', required: true},
    stockBalance: {type: 'Number', required: true},
    photo: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
})

module.exports = model('Products', Products)
