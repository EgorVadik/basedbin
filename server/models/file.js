const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    content: {
        type: String,
    },
    lastModified: {
        type: Date,
    },
})

let File = mongoose.model('File', fileSchema)

module.exports = File
