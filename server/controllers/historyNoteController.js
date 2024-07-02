const HistoryNote = require("../models/historyNoteModel")

const createHistory = async (request, h) => {
    try {
        const { noteId, action } = request.payload;
        const email = request.auth.credentials.user.id;

        const newHistoryNote = new HistoryNote({
            noteId,
            email,
            action
        });

        await newHistoryNote.save();

        return h.response({ message: 'History note created successfully', historyNote: newHistoryNote }).code(201);
    } catch (error) {
        return h.response({ error: 'Failed to create history note' }).code(500);
    }
}

module.exports = {
    createHistory
};
