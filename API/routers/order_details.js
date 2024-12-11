const express = require('express');
const { Order_details } = require('../Model/order_details')
const router = express.Router();

router.get('/:orderId/details', async (req, res) => {
    try {
        const { orderId } = req.params; 
        const orderDetails = await Order_details.find({ orderId: orderId })
            .populate('productId') 
            .populate('orderId');  

        if (!orderDetails || orderDetails.length === 0) {
            return res.status(404).json({ message: 'No details found for this order' });
        }
        res.status(200).json(orderDetails);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Error fetching order details', error: error.message });
    }
});

module.exports = router;
