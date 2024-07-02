const Note = require("../models/noteModel");
const HistoryNote = require("../models/historyNoteModel")

const createNote = async (request, h) => {
    try {
        const { title, content, categoryId } = request.payload;
        const { email } = request.auth.credentials.user;

        const note = new Note({
            title,
            content,
            email,
            categoryId
        });

        const historyNote = new HistoryNote({
            noteId: note._id,
            email: request.auth.credentials.user.email,
            action: 'create',
        });
        await historyNote.save();

        const result = await note.save();
        return h.response({ message: "Note created successfully", result }).code(201);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};


const getAllNotes = async (request, h) => {
    try {
        const { email } = request.auth.credentials.user;
        const notes = await Note.find({ email }).sort({ createdAt: -1 });
        return h.response(notes).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500)
    }
}

const getNotesByCategoriesId = async (request, h) => {
    try {
        const { email } = request.auth.credentials.user;
        const { categoryId } = request.params;
        const notes = await Note.find({ email, categoryId }).sort({ createAt: -1 })
        return h.response(notes).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500)
    }
}

const deleteNote = async (request, h) => {
    try {
        const id = request.params.id;
        const note = await Note.findByIdAndDelete(id);

        const historyNote = new HistoryNote({
            noteId: note._id,
            email: request.auth.credentials.user.email,
            action: 'delete',
        });
        await historyNote.save();

        return h.response({ message: "Note deleted successfully", note }).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500)
    }
}

const updateNote = async (request, h) => {
    try {
        const id = request.params.id;
        const { title, content, categoryId } = request.payload;
        const note = await Note.findByIdAndUpdate(id, { title, content, categoryId }, { new: true });
        if (!note) {
            return h.response({ message: "Note not found" }).code(404);
        }
        return h.response({ message: "Note updated successfully", note }).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

module.exports = {
    createNote,
    getAllNotes,
    deleteNote,
    updateNote,
    getNotesByCategoriesId
};
