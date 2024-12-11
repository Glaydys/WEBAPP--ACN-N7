import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './revise.css';

const ReviseCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    category_id: '',
    name_category: '',
    image_category: null, // Thêm trường để lưu hình ảnh
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/categories/${categoryId}`);
        if (response.data) {
          setCategory(response.data);
        } else {
          setError('Danh mục không tồn tại');
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        setError('Lỗi khi tải danh mục');
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setCategory((prev) => ({
        ...prev,
        [name]: files[0], // Lưu file vào state
      }));
    } else {
      setCategory((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo FormData để gửi dữ liệu
    const formData = new FormData();
    formData.append('category_id', category.category_id);
    formData.append('name_category', category.name_category);

    // Kiểm tra và thêm hình ảnh vào FormData
    if (category.image_category) {
      formData.append('image_category', category.image_category);
    }

    try {
      await axios.put(`http://localhost:3003/categories/${categoryId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Cập nhật danh mục thành công');
      navigate('/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Lỗi khi cập nhật danh mục');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Chỉnh sửa danh mục</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <label htmlFor="category_id">Mã danh mục:</label>
        <input
          type="number"
          id="category_id"
          name="category_id"
          value={category.category_id}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="name_category">Tên danh mục:</label>
        <input
          type="text"
          id="name_category"
          name="name_category"
          value={category.name_category}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="image_category">Hình ảnh danh mục:</label>
        <input
          type="file"
          id="image_category"
          name="image_category"
          onChange={handleChange}
        /><br /><br />

        <button type="submit">Lưu danh mục</button>
      </form>
    </div>
  );
};

export default ReviseCategory;
