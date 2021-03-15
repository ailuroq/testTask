const productController = require('../controllers/products.controller')
const { authJwt } = require('../middlewares')

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        )
        next()
    })
    app.get('/api/products', productController.getAllProducts)
    app.get('/api/products/find/:name', productController.getProduct)
    app.get('/api/products/get-with-conditionals', productController.getProductByNameWithConditionals)
    app.post('/api/products/add', productController.addProduct)
    app.post('/api/products/delete/:name', productController.deleteProduct)
    app.post('/api/products/update/:name', productController.updateProduct)
    app.post('/api/products/upload/:name', [authJwt.verifyToken,authJwt.isAdmin], productController.upload)

}