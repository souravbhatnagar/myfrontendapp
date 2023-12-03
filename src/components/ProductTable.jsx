import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

// Modal component
const UpdateProductModal = ({ isOpen, onClose, onUpdate, initialData }) => {
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
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        <br />
        <label>Description:</label>
        <input type="text" name="description" value={formData.description} onChange={handleInputChange} />
        <br />
        <label>Price:</label>
        <input type="text" name="price" value={formData.price} onChange={handleInputChange} />
        <br />
        <button type="submit">Update</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

UpdateProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  initialData: PropTypes.object.isRequired,
};

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
  }, []);

  const handleUpdate = (productId) => {
    const productToUpdate = products.find((product) => product.id === productId);
    setSelectedProduct(productToUpdate);
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateSubmit = async (updatedData) => {
    try {
      const response = await api.put(`/products/${selectedProduct.id}`, updatedData);

      if (response.status === 200) {
        console.log('Product updated successfully!');
        // Refresh the product list after update
        const updatedProducts = products.map((product) =>
          product.id === selectedProduct.id ? { ...product, ...updatedData } : product
        );
        setProducts(updatedProducts);
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
    handleCloseUpdateModal();
  };

  const handleDelete = async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);

      if (response.status === 204) {
        console.log('Product deleted successfully!');
        // Refresh the product list after deletion
        const updatedProducts = products.filter((product) => product.id !== productId);
        setProducts(updatedProducts);
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <h2>Product Table</h2>
      {products.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>
                  <button onClick={() => handleUpdate(product.id)}>Update</button>
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}

      {/* Update Product Modal */}
      {selectedProduct && (
        <UpdateProductModal
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          onUpdate={handleUpdateSubmit}
          initialData={selectedProduct || {}}
        />
      )}
    </div>
  );
};

export default ProductTable;