import React from 'react';
import axios from 'axios';
import './revise.css';

const FormAddProduct = () => {

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Tạo FormData từ form
    console.log(formData)
    try {
      const response = await axios.post('http://localhost:3003/products/FormAddProduct/alert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Thêm sản phẩm thành công !!!"); // Hiển thị thông báo thành công
    } catch (error) {
      alert(error)
      console.error('Lỗi khi thêm sản phẩm:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm!');
    }
  };

  return (
    <div>
      <h1>Thêm sản phẩm mới</h1>
      <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">

        <label htmlFor="category_id">Mã kho:</label>
        <input type="number" id="category_id" name="category_id" required /><br /><br />

        <label htmlFor="name_product">Tên sản phẩm:</label>
        <input type="text" id="name_product" name="name_product" required /><br /><br />

        <label htmlFor="description">Mô tả sản phẩm:</label>
        <textarea id="description" name="description"></textarea><br /><br />

        <label htmlFor="price">Giá sản phẩm:</label>
        <input type="number" id="price" name="price" required /><br /><br />

        <label htmlFor="quantity">Số lượng:</label>
        <input type="number" id="quantity" name="quantity" required /><br /><br />

        <label htmlFor="image_product">Chọn hình ảnh:</label>
        <input type="file" id="image_product" name="image_product" accept="image/*" required /><br /><br />

        <button type="submit">Thêm sản phẩm</button>
      </form>
    </div>
  );
};

export default FormAddProduct;
