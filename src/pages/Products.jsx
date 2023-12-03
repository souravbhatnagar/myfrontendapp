import { useState, useEffect } from 'react';
import ProductTable from '../components/ProductTable';
import api from '../services/api';

const Products = () => {
  const [isAddFormVisible, setAddFormVisibility] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  });

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
      const response = await api.post('/products', formData);

      if (response.status === 201) {
        console.log('Product added successfully!');
        toggleAddForm();
        const updatedProductList = await api.get('/api/products');
        setProducts(updatedProductList.data);
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
      <h1>Products Page</h1>

      <button onClick={toggleAddForm}>Add Product</button>

      {isAddFormVisible && (
        <div>
          <h2>Add Product</h2>
          <form onSubmit={handleFormSubmit}>
            <label>Name:</label>
            <input type="text" name="name" onChange={handleInputChange} />
            <br />
            <label>Description:</label>
            <input type="text" name="description" onChange={handleInputChange} />
            <br />
            <label>Price:</label>
            <input type="text" name="price" onChange={handleInputChange} />
            <br />
            <button type="submit">Save</button>
          </form>
        </div>
      )}

      <ProductTable setProducts={setProducts} />
    </div>
  );
};

export default Products;
