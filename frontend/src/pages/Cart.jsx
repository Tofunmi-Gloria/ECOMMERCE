import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, fetchCart, updateQuantity, removeFromCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  if (!user) {
    return (
      <div className="container">
        <p className="empty-state">Please <Link to="/login">login</Link> to view your cart.</p>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container">
        <p className="empty-state">Your cart is empty. <Link to="/">Continue shopping</Link></p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Your Cart</h1>
      <div className="cart-list">
        {cart.items.map((item) => (
          <div className="cart-item" key={`${item.product}-${item.variantId || 'base'}`}>
            <img src={item.image || ''} alt={item.name} className="cart-item-img" />
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p>₦{item.price.toLocaleString()} each</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.product, item.variantId, Number(e.target.value))}
            />
            <p className="cart-item-subtotal">₦{(item.price * item.quantity).toLocaleString()}</p>
            <button className="btn-link danger" onClick={() => removeFromCart(item.product, item.variantId)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: ₦{totalAmount.toLocaleString()}</h3>
        <button className="btn-primary" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
      </div>
    </div>
  );
}