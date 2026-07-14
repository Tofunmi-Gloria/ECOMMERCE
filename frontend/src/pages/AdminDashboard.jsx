import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', sku: '', category: '', stock: '', images: '',
  });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  const loadData = () => {
    api.get('/products', { params: { limit: 100 } }).then((res) => setProducts(res.data.products));
    api.get('/categories').then((res) => setCategories(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', categoryForm);
      setCategoryForm({ name: '', description: '' });
      setMessage('Category created');
      loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    loadData();
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        images: productForm.images ? productForm.images.split(',').map((s) => s.trim()) : [],
      });
      setProductForm({ name: '', description: '', price: '', sku: '', category: '', stock: '', images: '' });
      setMessage('Product created');
      loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Deactivate this product?')) return;
    await api.delete(`/products/${id}`);
    loadData();
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div className="tabs">
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Products</button>
        <button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Categories</button>
      </div>

      {message && <p className="form-message">{message}</p>}

      {tab === 'categories' && (
        <div className="admin-section">
          <form className="inline-form" onSubmit={handleCreateCategory}>
            <input
              placeholder="Category name"
              required
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            />
            <input
              placeholder="Description"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
            />
            <button className="btn-primary" type="submit">Add Category</button>
          </form>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td><button className="btn-link danger" onClick={() => handleDeleteCategory(c._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'products' && (
        <div className="admin-section">
          <form className="admin-product-form" onSubmit={handleCreateProduct}>
            <input placeholder="Product name" required value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
            <input placeholder="SKU" required value={productForm.sku}
              onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} />
            <select required value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input type="number" placeholder="Price" required value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
            <input type="number" placeholder="Stock" required value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
            <input placeholder="Image URL(s), comma separated" value={productForm.images}
              onChange={(e) => setProductForm({ ...productForm, images: e.target.value })} />
            <textarea placeholder="Description" required value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
            <button className="btn-primary" type="submit">Add Product</button>
          </form>

          <table className="admin-table">
            <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>₦{p.price.toLocaleString()}</td>
                  <td>{p.totalStock ?? p.stock}</td>
                  <td>{p.category?.name}</td>
                  <td><button className="btn-link danger" onClick={() => handleDeleteProduct(p._id)}>Deactivate</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}