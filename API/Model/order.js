const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    OrderDate: { type: Date },
    TotalAmount: { type: Number },
    OrderCode: { type: String },
    Status: { type: String },
});


const Order = mongoose.models.Order || mongoose.model('Order', orderSchema, 'orders');

module.exports = { Order };
