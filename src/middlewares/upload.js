const util = require('util')
const multer = require('multer')
const path = require('path')
const db = require('../models')
const Image = db.image
const Products = db.products

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: async (req, file, cb) => {
        const filename = Date.now() + '-' + file.originalname
        const productToUpdate = await Products.findOne({name: req.params.name})
        const productPhoto = new Image({
            path: 'public/uploads/' + filename,
            name: filename,
            productId: productToUpdate._id
        })
        await productPhoto.save()
        const product = await Products.findOneAndUpdate(
            {name: req.params.name},
            { $push: { photo: productPhoto._id } },
            { new: true, useFindAndModify: false }
        )
        cb(null, filename)
    }
})

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 }, // 1MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            const err = new Error('Extension')
            return cb(err)
        }
        cb(null, true)
    }
}).single('file')

let uploadFileMiddleware = util.promisify(uploadFile)
module.exports = uploadFileMiddleware