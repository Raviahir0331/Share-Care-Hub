import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DonationForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const DonationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    productName: '',
    description: '',
    quality: '',
    quantity: '',
    donationImage: null,
    terms: false,
  });

  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all products
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, donationImage: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'donationImage' && formData[key]) {
        data.append(key, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    if (editId) {
      axios.put(`http://localhost:5000/api/products/${editId}`, data)
        .then(response => {
          setProducts(products.map(product => product._id === editId ? response.data : product));
          setEditId(null);
          setShowModal(false);
          resetForm();
        })
        .catch(error => {
          console.error('Error updating product:', error);
          alert('Error updating product');
        });
    } else {
        axios.post('http://localhost:5000/api/products', data)
        .then(response => {
          setProducts([...products, response.data]);
          resetForm();
          alert('Product added successfully');
        })
        .catch(error => {
          console.error('Error adding product:', error.response ? error.response.data : error.message);
          alert('Product not added');
        });
      
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      category: '',
      productName: '',
      description: '',
      quality: '',
      quantity: '',
      donationImage: null,
      terms: false,
    });
  };

  // Handle edit product
  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      fullName: product.fullName,
      email: product.email,
      phone: product.phone,
      address: product.address,
      category: product.category,
      productName: product.productName,
      description: product.description,
      quality: product.quality,
      quantity: product.quantity,
      donationImage: null, // Not showing image during edit
      terms: product.terms,
    });
    setShowModal(true);
  };

  // Handle delete product
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product._id !== id));
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  return (
    <div className="container-fluid">
      <div className="form-container">
        <form className="enhanced-donation-form" onSubmit={handleSubmit}>
          <h2>Manage Products</h2>
          <label>
            Full Name
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" required />
          </label>
          <label>
            Phone
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" required />
          </label>
          <label>
            Address
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter your address" required />
          </label>
          <label>
            Category
            <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="Enter product category" required />
          </label>
          <label>
            Product Name
            <input type="text" name="productName" value={formData.productName} onChange={handleInputChange} placeholder="Enter product name" required />
          </label>
          <label>
            Description
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter product description"></textarea>
          </label>
          <label>
            Quality
            <input type="text" name="quality" value={formData.quality} onChange={handleInputChange} placeholder="Enter product quality" required />
          </label>
          <label>
            Quantity
            <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="Enter quantity" required />
          </label>
          <label>
            Upload Image
            <input type="file" name="donationImage" onChange={handleFileChange} accept="image/*" />
          </label>
          <label>
            <input type="checkbox" name="terms" checked={formData.terms} onChange={handleInputChange} />
            I agree to the terms and conditions
          </label>
          <button type="submit" className="btn btn-primary">Save Product</button>
        </form>
      </div>

      <div className="donation-list">
  <h2>Product List</h2>
  <table className="table table-striped">
    <thead>
      <tr>
        <th>Image</th>
        <th>Full Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Address</th>
        <th>Category</th>
        <th>Product Name</th>
        <th>Description</th>
        <th>Quality</th>
        <th>Quantity</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.map(product => (
        <tr key={product._id}>
          <td>
            {product.donationImage ? (
              <img src={`http://localhost:5000/${product.donationImage}`} alt={product.productName} className="img-thumbnail" style={{ width: '130px', height: '120px' }} />
            ) : (
              'No image'
            )}
          </td>
          <td>{product.fullName}</td>
          <td>{product.email}</td>
          <td>{product.phone}</td>
          <td>{product.address}</td>
          <td>{product.category}</td>
          <td>{product.productName}</td>
          <td>{product.description}</td>
          <td>{product.quality}</td>
          <td>{product.quantity}</td>
          <td>
            <button className="btn btn-warning btn-sm" onClick={() => handleEdit(product)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product._id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Modal for editing product */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} aria-labelledby="editProductModalLabel" aria-hidden={!showModal}>
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="editProductModalLabel">Edit Product</h5>
        <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input type="text" id="fullName" name="fullName" className="form-control" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" required />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input type="tel" id="phone" name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" required />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <input type="text" id="address" name="address" className="form-control" value={formData.address} onChange={handleInputChange} placeholder="Enter your address" required />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <input type="text" id="category" name="category" className="form-control" value={formData.category} onChange={handleInputChange} placeholder="Enter product category" required />
          </div>
          <div className="mb-3">
            <label htmlFor="productName" className="form-label">Product Name</label>
            <input type="text" id="productName" name="productName" className="form-control" value={formData.productName} onChange={handleInputChange} placeholder="Enter product name" required />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea id="description" name="description" className="form-control" value={formData.description} onChange={handleInputChange} placeholder="Enter product description"></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="quality" className="form-label">Quality</label>
            <input type="text" id="quality" name="quality" className="form-control" value={formData.quality} onChange={handleInputChange} placeholder="Enter product quality" required />
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input type="number" id="quantity" name="quantity" className="form-control" value={formData.quantity} onChange={handleInputChange} placeholder="Enter quantity" required />
          </div>
          <div className="mb-3">
            <label htmlFor="donationImage" className="form-label">Upload Image</label>
            <input type="file" id="donationImage" name="donationImage" className="form-control" onChange={handleFileChange} accept="image/*" />
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" id="terms" name="terms" className="form-check-input" checked={formData.terms} onChange={handleInputChange} />
            <label htmlFor="terms" className="form-check-label">I agree to the terms and conditions</label>
          </div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default DonationForm;
