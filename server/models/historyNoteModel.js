const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const historyNoteSchema = new Schema({
    noteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
        required: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        ref: 'Customer',
        required: true
    },
    action: {
        type: String,
        required: true
    }
},{ timestamps: true })

module.exports = mongoose.model("HistoryNote", historyNoteSchema);
