import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setMessage('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container"><p className="empty-state">Loading...</p></div>;
  if (!product) return <div className="container"><p className="empty-state">{message || 'Product not found'}</p></div>;

  const currentPrice = product.price + (selectedVariant?.priceModifier || 0);
  const currentStock = selectedVariant ? selectedVariant.stock : product.totalStock ?? product.stock;

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    try {
      await addToCart(product._id, selectedVariant?._id || null, quantity);
      setMessage('Added to cart!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not add to cart');
    }
  };

  return (
    <div className="container">
      <div className="product-detail">
        <div className="product-detail-image">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} />
          ) : (
            <div className="image-placeholder large">No Image</div>
          )}
        </div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category?.name}</p>
          <p className="product-detail-price">₦{currentPrice.toLocaleString()}</p>
          <p className="product-description">{product.description}</p>

          {product.variants?.length > 0 && (
            <div className="variant-picker">
              <label>Choose an option:</label>
              <div className="variant-options">
                {product.variants.map((v) => (
                  <button
                    key={v._id}
                    className={`variant-btn ${selectedVariant?._id === v._id ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock === 0}
                  >
                    {v.name} {v.stock === 0 ? '(Out of stock)' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className={`stock-indicator ${currentStock === 0 ? 'out' : ''}`}>
            {currentStock > 0 ? `${currentStock} in stock` : 'Out of stock'}
          </p>

          <div className="qty-and-cart">
            <input
              type="number"
              min="1"
              max={currentStock || 1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
            <button
              className="btn-primary"
              disabled={currentStock === 0 || (product.variants?.length > 0 && !selectedVariant)}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
          {message && <p className="form-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}