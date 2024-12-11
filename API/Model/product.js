const mongoose = require('mongoose');

// Định nghĩa schema cho sản phẩm
const productSchema = new mongoose.Schema({
    category_id: { type: Number, required: true },
    name_product: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true}, 
    image_product: { type: String, required: true }, 
    averageRating: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
},);

let Product = mongoose.model('Product', productSchema, 'product');

module.exports = Product;
