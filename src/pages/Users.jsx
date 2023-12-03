import { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import api from '../services/api';

const Users = () => {
  const [isAddFormVisible, setAddFormVisibility] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [users, setUsers] = useState([]);

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

  const toggleAddForm = () => {
    setAddFormVisibility(!isAddFormVisible);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/users', formData);

      if (response.status === 201) {
        console.log('User added successfully!');
        toggleAddForm();
        const updatedUsers = [...users, response.data];
        setUsers(updatedUsers);
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div>
      <h1>Users Page</h1>

      <button onClick={toggleAddForm}>Add User</button>

      {isAddFormVisible && (
        <div>
          <h2>Add User</h2>
          <form onSubmit={handleFormSubmit}>
            <label>Username:</label>
            <input type="text" name="username" onChange={handleInputChange} />
            <br />
            <label>Email:</label>
            <input type="text" name="email" onChange={handleInputChange} />
            <br />
            <button type="submit">Save</button>
          </form>
        </div>
      )}

      <UserTable users={users} setUsers={setUsers} />
    </div>
  );
};

export default Users;
