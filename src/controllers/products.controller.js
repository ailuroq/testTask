const db = require('../models')

const Products = db.products
const Image = db.image

const uploadFile = require('../middlewares/upload')
const fs = require("fs");

exports.addProduct = async (req, res) => {
    const product = new Products({
        name: req.body.name,
        price: req.body.price,
        stockBalance: req.body.stockBalance
    })
    product.save((err, product) => {
        if (err) {
            return res.status(500).send({message: err})
        }
        return res.status(201).send({message: 'Product successfully created!'})
    })
}

exports.updateProduct = async (req, res) => {
    let dataToUpdate = {}
    if (req.body.name) {
        dataToUpdate = {
            ...dataToUpdate,
            'name': req.body.name
        }
    }
    if (req.body.price) {
        dataToUpdate = {
            ...dataToUpdate,
            'price': req.body.price
        }
    }
    if (req.body.stockBalance) {
        dataToUpdate = {
            ...dataToUpdate,
            'stockBalance': req.body.stockBalance
        }
    }
    const updatedProduct = await Products.findOneAndUpdate(
        {name: req.params.name},
        {$set: dataToUpdate},
        {new: true, useFindAndModify: false},
        (err, doc) => {
            if (err) {
                return res.status(500).send({message: err})
            }
        })
    return res.send({message: 'successfully modified'})
}

exports.deleteProduct = async (req, res) => {
    Products.findOneAndRemove({name: req.params.name}, (err, product) => {
        if (product) {
            Image.findOneAndRemove({productId: product._id}, (err, photo) => {
                if (photo) {
                    fs.unlink(photo.path, (err) => {
                        if (err) {
                            return res.status(200).send({message: 'Product deleted with photo'})
                        }
                    })
                }
            })
        }
        if (err) {
            return res.status(500).send({message: err})
        }
        return res.status(200).send({message: 'Product deleted successfully'})
    })
}

exports.getProduct = async (req, res) => {
    const product = await Products.findOne({name: req.params.name})
    if (!product) {
        return res.status(500).send({message: 'Cant find product'})
    }
    res.json(product)

}

exports.getAllProducts = async (req, res) => {
    const {page = 1, limit = 10} = req.query

    try {
        const products = await Products.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

        const numberOfProducts = await Products.countDocuments()

        res.status(200).send({
            products,
            totalPages: Math.ceil(numberOfProducts / limit),
            currentPage: page,
            limit: limit
        })
    } catch (e) {
        res.status(500).send({message: e})
    }
}

exports.getProductByNameWithConditionals = async (req, res) => {
    const {name, price} = req.query
    const product = await Products.find({name: name})
        .where('price').lte(price)
        .where('stockBalance').gt(0)
    if (product) {
        return res.json(product)
    }
    return res.status(500).send({message: 'Cant find this product'})


}


exports.upload = async (req, res) => {
    try {
        await uploadFile(req, res)

        if (req.file === undefined) {
            return res.status(400).send({message: 'Please upload a file!'})
        }

        res.status(200).send({
            message: 'Uploaded the file successfully: ' + req.file.originalname
        })
    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${err}`
        })
    }
}