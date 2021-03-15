const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
require('dotenv').config()

const corsOptions = {
    origin: 'http://localhost:8081'
}

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

//static
app.use(express.static(path.join(__dirname, 'public/uploads')))

if (!module.parent) {
    const db = require('./src/models')
    const initial = require('./src/database/initialRoles')
    db.mongoose
        .connect(`${process.env.mongodbUrl}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('Successfully connect to MongoDB.')
            initial()
        })
        .catch(err => {
            console.error('Connection error', err)
            process.exit()
        })
}


// routes
require('./src/routes/auth.routes')(app)
require('./src/routes/user.routes')(app)
require('./src/routes/products.routes')(app)

// set port, listen for requests
PORT = 8080
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})

module.exports = app