const CategoryNote = require("../models/categoryNoteModel")

const getCategories = async (request, h) => {
    try {
        const { email: customerEmail } = request.auth.credentials.user;
        const categories = await CategoryNote.find({ customerEmail });
        return h.response(categories).code(200);
    } catch (error) {
        console.error('Error in getCategories:', error);
        return h.response({ message: error.message }).code(500);
    }
};

const createCategory = async (request, h) => {
    try {
        const { categoryName } = request.payload;
        const { email: customerEmail } = request.auth.credentials.user;

        if (!categoryName) {
            return h.response({ message: 'Category name is required' }).code(400);
        }

        if (!customerEmail) {
            return h.response({ message: 'User email not found in token' }).code(400);
        }

        const category = new CategoryNote({
            category: categoryName,
            customerEmail: customerEmail
        });

        const result = await category.save();
        return h.response({ message: 'Category created successfully', result }).code(201);
    } catch (error) {
        console.error('Error in createCategory:', error);
        return h.response({ message: error.message }).code(500);
    }
};


const deleteCategory = async (request, h) => {
    try {
        const id = request.params.id;
        const category = await CategoryNote.findByIdAndDelete(id);
        return h.response({ message: "Category deleted successfully", category }).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500)
    }
}

const updateCategory = async (request, h) => {
    try {
        const id = request.params.id;
        const { categoryName } = request.payload;
        const category = await CategoryNote.findByIdAndUpdate(
            id,
            { category: categoryName },
            { new: true }
        );
        if (!category) {
            return h.response({ message: "Category not found" }).code(404);
        }
        return h.response({ message: "Category updated successfully", category }).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};



module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory
}