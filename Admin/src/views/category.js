import React, { useEffect, useState } from "react";
import './products.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Category = () => {
    const [category, setCategory] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get('http://localhost:3003/categories');
                setCategory(response.data);
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };
        fetchCategory();
    }, []);

    const handleDelete = async (categoryId) => {
        try {
            await axios.delete(`http://localhost:3003/categories/${categoryId}`);
            setCategory(category.filter(cat => cat.category_id !== categoryId));
            alert('Danh mục đã được xóa thành công');
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Có lỗi xảy ra khi xóa danh mục');
        }
    };

    return (
        <div>
            <button onClick={() => navigate("/categories/FormAddCategory")}>Add</button> {/* Gọi hàm handleAddProduct */}
            <h2>Category Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>Category Id</th>
                        <th>Name Category</th>
                        <th>Image</th>
                        <th>Revise</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {category.map((category) => (
                        <tr key={category.category_id}>
                            <td>{category.category_id}</td>
                            <td>{category.name_category}</td>
                            <td><img src={`${category.image_category}`} alt={category.name_category} style={{ width: '100px' }} /></td>
                            <td>
                                <button onClick={() => navigate(`/reviseCategory/${category.category_id}`)}>Revise</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(category.category_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default Category;
