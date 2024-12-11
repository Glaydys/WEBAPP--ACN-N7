import React from 'react';
import axios from 'axios';

function FormAddCategory() {

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const response = await axios.post('http://localhost:3003/categories/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            alert("Thêm danh mục thành công !!!");
        } catch (error) {
            alert(error)
            console.error('Lỗi khi thêm danh mục:', error);
            alert('Có lỗi xảy ra khi thêm danh mục!');
        }
    }

    return (
        <div>
            <h1>Add category</h1>
            <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">

                <label htmlFor="category_id">Mã kho:</label>
                <input type="number" id="category_id" name="category_id" required /><br /><br />

                <label htmlFor="name_category">Tên sản phẩm:</label>
                <input type="text" id="name_category" name="name_category" required /><br /><br />

                <label htmlFor="image_category">Chọn hình ảnh:</label>
                <input type="file" id="image_category" name="image_category" accept="image/*" required /><br /><br />

                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default FormAddCategory

