const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category_id: Number,
    name_category: String,
    image_category: String,
});

let Category = mongoose.model('Category', CategorySchema, 'category');

module.exports = Category;