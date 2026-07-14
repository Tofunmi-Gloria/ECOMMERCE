import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart, totalAmount, fetchCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ street: '', city: '', state: '', country: '', zip: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: form,
        paymentMethod: 'cash_on_delivery',
      });
      await fetchCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return <div className="container"><p className="empty-state">Your cart is empty.</p></div>;
  }

  return (
    <div className="container narrow">
      <h1>Checkout</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input name="street" placeholder="Street address" value={form.street} onChange={handleChange} required />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
        <input name="zip" placeholder="Postal code" value={form.zip} onChange={handleChange} />
        <h3>Total: ₦{totalAmount.toLocaleString()}</h3>
        {error && <p className="form-message error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}