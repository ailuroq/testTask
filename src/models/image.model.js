const { model, Types, Schema } = require('mongoose')

const Image = new Schema({
    path: { type: String, required: true, trim: true },
    name: { type: String, required: true },
    productId: { type: Types.ObjectId, ref: 'Products' }
})

module.exports = model('Image', Image)
