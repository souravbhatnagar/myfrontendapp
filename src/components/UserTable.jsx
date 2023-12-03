import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

// Modal component
const UpdateUserModal = ({ isOpen, onClose, onUpdate, initialData }) => {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <h2>Update User</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
        <br />
        <label>Email:</label>
        <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
        <br />
        <button type="submit">Update</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

UpdateUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  initialData: PropTypes.object.isRequired,
};

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdate = (userId) => {
    const userToUpdate = users.find((user) => user.id === userId);
    setSelectedUser(userToUpdate);
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateSubmit = async (updatedData) => {
    try {
      const response = await api.put(`/users/${selectedUser.id}`, updatedData);

      if (response.status === 200) {
        console.log('User updated successfully!');
        // Refresh the user list after update
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id ? { ...user, ...updatedData } : user
        );
        setUsers(updatedUsers);
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }

    handleCloseUpdateModal(); // Close modal after submission
  };

  const handleDelete = async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);

      if (response.status === 204) {
        console.log('User deleted successfully!');
        // Refresh the user list after deletion
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h2>User Table</h2>
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleUpdate(user.id)}>Update</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}

      {/* Update User Modal */}
      {selectedUser && (
        <UpdateUserModal
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          onUpdate={handleUpdateSubmit}
          initialData={selectedUser}
        />
      )}
    </div>
  );
};

export default UserTable;
