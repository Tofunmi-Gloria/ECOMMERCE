import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const inStock = (product.totalStock ?? product.stock) > 0;
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <div className="image-placeholder">No Image</div>
        )}
        {!inStock && <span className="out-of-stock-tag">Out of stock</span>}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-category">{product.category?.name}</p>
        <p className="product-price">₦{product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}