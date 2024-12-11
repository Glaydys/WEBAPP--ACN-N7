const express = require('express');
const Rate = require('../Model/comment'); // Model Rate
const Product = require('../Model/product'); // Model Product
const router = express.Router();

// POST: Thêm đánh giá và bình luận
router.post('/rate', async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    if (!userId || !productId || rating === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let rate = await Rate.findById(productId);

    if (rate) {
      const hasRated = rate.users.some((user) => user.userId.toString() === userId);
      if (hasRated) {
        return res.status(403).json({ message: 'You have already rated this product' });
      }
    }

    if (!rate) {
      rate = new Rate({
        _id: productId,
        users: [
          {
            userId,
            comment,
            rate: rating,
            createdAt: new Date(),
          },
        ],
        rate: rating,
      });
    } else {
      rate.users.push({
        userId,
        comment,
        rate: rating,
        createdAt: new Date(),
      });

      const totalRates = rate.users.reduce((acc, user) => acc + user.rate, 0);
      rate.rate = totalRates / rate.users.length;
    }

    await rate.save();

    const totalComments = rate.users.length;
    const averageRating = rate.rate;

    await Product.findByIdAndUpdate(productId, {
      averageRating,
      totalComments,
    });

    res.status(200).json({ message: 'Rating added successfully', rate });
  } catch (err) {
    res.status(500).json({ message: 'Error adding rating', error: err.message });
  }
});

// GET: Lấy danh sách bình luận, điểm trung bình và tổng số bình luận
router.get('/rate/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const rate = await Rate.findById(productId).populate('users.userId', 'username');

    if (!rate || rate.users.length === 0) {
      return res.status(200).json({ 
        message: 'No ratings found', 
        averageRating: 0, 
        totalComments: 0, 
        users: [] 
      });
    }

    const totalRates = rate.users.reduce((acc, user) => acc + user.rate, 0);
    const averageRating = (totalRates / rate.users.length).toFixed(1); 
    const totalComments = rate.users.length;

   
    await Product.findByIdAndUpdate(productId, {
      averageRating,  
      totalComments,  
    });

    res.status(200).json({ 
      averageRating, 
      totalComments, 
      users: rate.users 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ratings', error: err.message });
  }
});

// DELETE: Xóa bình luận
router.delete('/rate/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;  

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }

    const rate = await Rate.findOne({ 'users._id': commentId });

    if (!rate) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const comment = rate.users.find(user => user._id.toString() === commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own comments' });
    }
    // Nếu userId khớp, xóa bình luận
    const commentIndex = rate.users.findIndex(user => user._id.toString() === commentId);
    rate.users.splice(commentIndex, 1);

    if (rate.users.length > 0) {
      const totalRates = rate.users.reduce((acc, user) => acc + user.rate, 0);
      rate.rate = totalRates / rate.users.length;
    } else {
      rate.rate = 0;
    }

    await rate.save();

    const totalComments = rate.users.length;
    const averageRating = rate.rate;

    await Product.findByIdAndUpdate(rate._id, {
      averageRating, 
      totalComments, 
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
});

module.exports = router;
