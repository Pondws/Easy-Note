const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categoryNoteSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        ref: 'Customer',
        required: true
    }
});

module.exports = mongoose.model("CategoryNote", categoryNoteSchema);
