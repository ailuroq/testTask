const db = require('../models')
const User = db.user
const upload = require('./../middlewares/upload')
const path = require('path')

exports.userProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        })
        res.json(user)
    } catch (e) {
        res.status(500).json({ message: 'Something gone wrong, try again' })
    }
}


