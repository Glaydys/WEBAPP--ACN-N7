const express = require('express');
const mongoose = require('mongoose');
const Product = require('../Model/product');
const router = express.Router()

router.get('/products/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).send("Query parameter is required");
    }

    console.log("Search Query:", query);

    const regexQuery = new RegExp(query, 'i');  // Tạo regex với tùy chọn 'i'
    const products = await Product.find({
      name_product: { $regex: regexQuery },
    });

    console.log("Found Products:", products);

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found matching your query.' });
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



module.exports = router
