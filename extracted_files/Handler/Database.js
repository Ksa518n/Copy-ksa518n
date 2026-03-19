module.exports = async Client => {
    
const Mongoose = require('mongoose')
const mongoUrl = process.env.MONGODB_URL || require('../config.json').MongooDB
Mongoose.connect(mongoUrl).then(() => {
    console.log('Database Connected')
}).catch(() => {
    console.log('Filed Connected')
})}