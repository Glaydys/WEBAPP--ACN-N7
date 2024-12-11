import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './User.css';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/user');
        console.log('Fetched users:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3003/api/user/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="user-container">
      <h2 className="user-title">User List</h2>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <ul className="user-list">
          {users.length > 0 ? (
            users.map(user => (
              <li key={user._id} className="user-item">
                <strong>Username:</strong> {user.username} <br />
                <strong>Email:</strong> {user.email} <br />
                <strong>Address:</strong> {user.address || 'No address provided'} <br />
                <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()} <br />
                <strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()} <br />
                <button className="delete-button" onClick={() => handleDelete(user._id)}>
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li className="no-users">No users found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default User;
