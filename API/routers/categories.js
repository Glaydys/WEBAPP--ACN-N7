const express = require("express")
const Category = require("../Model/category")
const app = express.Router()
const multer = require('multer');
const path = require('path');

// Cấu hình để sử dụng thư mục public cho ảnh tĩnh
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

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


app.post('/add', upload.single('image_category'), async (req, res) => {
  const { category_id, name_category } = req.body
  const image_category = req.file

  if (!image_category) {
    return res.send('Vui lòng tải lên một hình ảnh.');
  }

  const newCategory = new Category({
    category_id,
    name_category,
    image_category: '/uploads/' + image_category.filename
  });

  try {
    await newCategory.save()
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(500).json(error)
  }
})
// Lấy danh mục theo category_id
app.get('/:category_id', async (req, res) => {
  const categoryId = parseInt(req.params.category_id, 10);
  try {
    const category = await Category.findOne({ category_id: categoryId });
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: 'Danh mục không tồn tại' });
    }
  } catch (error) {
    console.error('Lỗi khi tải danh mục:', error);
    res.status(500).json({ error: 'Lỗi khi tải danh mục' });
  }
});

// Cập nhật thông tin danh mục theo category_id
app.put('/:category_id', upload.single('image_category'), async (req, res) => {
  const categoryId = parseInt(req.params.category_id, 10);
  const updatedCategory = {
    name_category: req.body.name_category,
  };

  if (req.file) {
    updatedCategory.image_category = '/uploads/' + req.file.filename;
  }

  try {
    const result = await Category.updateOne(
      { category_id: categoryId },
      { $set: updatedCategory }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Danh mục đã được cập nhật thành công' });
    } else {
      res.status(404).json({ error: 'Danh mục không tồn tại hoặc không có thay đổi nào' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật danh mục:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật danh mục' });
  }
});

//route xóa
app.delete('/:category_id', async (req, res) => {
  const { category_id } = req.params;
  try {
    // Tìm và xóa category theo category_id
    const deletedCategory = await Category.findOneAndDelete({ category_id: parseInt(category_id, 10) });
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }
    res.status(200).json({ message: 'Danh mục đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa danh mục:', error);
    res.status(500).json({ message: 'Lỗi khi xóa danh mục' });
  }
});


module.exports = app
