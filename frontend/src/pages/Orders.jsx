import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p className="empty-state">Loading orders...</p></div>;
  if (orders.length === 0) return <div className="container"><p className="empty-state">No orders yet.</p></div>;

  return (
    <div className="container">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((o) => (
          <Link to={`/orders/${o._id}`} key={o._id} className="order-row">
            <span>#{o._id.slice(-6).toUpperCase()}</span>
            <span>{new Date(o.createdAt).toLocaleDateString()}</span>
            <span className={`status-tag ${o.status}`}>{o.status}</span>
            <span>₦{o.totalAmount.toLocaleString()}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <div className="container"><p className="empty-state">Loading...</p></div>;

  return (
    <div className="container narrow">
      <h1>Order #{order._id.slice(-6).toUpperCase()}</h1>
      <p className={`status-tag ${order.status}`}>{order.status}</p>
      <div className="order-items">
        {order.items.map((item, idx) => (
          <div className="order-item-row" key={idx}>
            <span>{item.name}</span>
            <span>x{item.quantity}</span>
            <span>₦{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <h3>Total: ₦{order.totalAmount.toLocaleString()}</h3>
      <h4>Shipping To:</h4>
      <p>
        {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state},{' '}
        {order.shippingAddress?.country}
      </p>
    </div>
  );
}