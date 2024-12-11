const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../Model/product.js');
const mongoose = require('mongoose'); 

const router = express.Router();

// Cấu hình để sử dụng thư mục public cho ảnh tĩnh
router.use('/uploads', express.static(path.join(__dirname, '../../Admin/public/uploads')));

// Cấu hình multer để lưu file vào thư mục public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../Admin/public/uploads')); // Lưu vào thư mục public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Đặt tên file với timestamp
  },
});

const upload = multer({ storage: storage });

// POST: Thêm sản phẩm
router.post('/FormAddProduct/alert', upload.single('image_product'), async (req, res) => {
  const { category_id, name_product, description, price, quantity } = req.body;
  const image_product = req.file;

  if (!image_product) {
    return res.send('Vui lòng tải lên một hình ảnh.');
  }

  const newProduct = new Product({
    category_id,
    name_product,
    description,
    price,
    quantity,
    image_product: '/uploads/' + image_product.filename,
  });

  try {
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send('Có lỗi xảy ra khi thêm sản phẩm!');
  }
});

// Route để xóa sản phẩm
router.delete('/:productId', async (req, res) => {
  const { productId } = req.params; 

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    console.error('Invalid product ID:', productId);
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    console.log('Attempting to delete product with ID:', productId);

    const deletedProduct = await Product.findOneAndDelete({ _id: productId });

    if (!deletedProduct) {
      console.warn('Product not found with ID:', productId);
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
  }
});

router.get('/category/:category_id', async (req, res) => {
  try {
    const category_id = req.params.category_id;

    const products = await Product.find({ category_id: category_id });

    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm cho danh mục này' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy sản phẩm theo danh mục', details: err });
  }
});

router.get('/similar/:category_id', async (req, res) => {
  const { category_id } = req.params;
  console.log("Fetching similar products for category_id:", category_id); // Thêm log
  try {
      const similarProducts = await Product.find({ category_id }).limit(10);
      if (similarProducts.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy sản phẩm tương tự' });
      }
      res.status(200).json(similarProducts);
  } catch (err) {
      console.error("Error fetching similar products:", err); // Log lỗi
      res.status(500).json({ error: 'Lỗi khi lấy sản phẩm tương tự', details: err });
  }
});

// Xuất router và upload
module.exports = { router, upload };
