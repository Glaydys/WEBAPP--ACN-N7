const mongoose = require('mongoose');

const order_DetailsSchema = new mongoose.Schema({
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        require: true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require: true
    },
    name_product: {type: String},
    price: {type: Number},
    quantity: {type: Number},
    TotalPrice: {type: Number},
    CreatedAt: {type: Date}
})

exports.Order_details = mongoose.model('Order_Details',order_DetailsSchema,'order_details')