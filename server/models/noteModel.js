const mongoose = require("mongoose")

const Schema = mongoose.Schema

const noteSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String
    },
    email: {
        type: String,
        ref: 'Customer',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryNote'
    }
}, { timestamps: true })

module.exports = mongoose.model("Note", noteSchema)