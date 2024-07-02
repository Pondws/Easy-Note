const mongoose = require("mongoose")

const Schema = mongoose.Schema

const customerSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Customer", customerSchema)