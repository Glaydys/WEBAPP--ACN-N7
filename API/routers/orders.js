const express = require('express');
const orderRouter = express.Router();
const { Order } = require('../Model/order');

orderRouter.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
    }
});

// Cập nhật status của order
orderRouter.put('/:orderId/status', async (req, res) => {
    try {
      const { status } = req.body;
      console.log('Request Body:', req.body);
      console.log('Order ID:', req.params.orderId);
  
      if (!status) {
        return res.status(400).json({ error: 'Trạng thái là bắt buộc' });
      }
  
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.orderId,
        { $set: { Status: status } },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
      }
  
      console.log('Updated Order:', updatedOrder);
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Lỗi server:', error);
      res.status(500).json({ error: 'Lỗi server' });
    }
  });

  orderRouter.get('/getorder', async (req, res) => {
    try {
      const { userId, status } = req.query; 
  
      let filter = { userId: userId };
  
      if (status) {
        filter.Status = status; 
      }
      const get = await Order.find(filter);
  
      res.status(200).json(get);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });  

module.exports = orderRouter;
