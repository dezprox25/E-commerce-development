import { useState, useEffect } from 'react';
import apiFetch from '../utils/api';
import Button from '../components/ui/Button';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/orders/my-orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this entire order?')) return;
    try {
      await apiFetch(`/orders/${orderId}/cancel`, { method: 'PUT' });
      fetchOrders();
    } catch (error) {
      alert(error.message || 'Failed to cancel order');
    }
  };

  const cancelItem = async (orderId, itemId) => {
    if (!confirm('Are you sure you want to remove this item from your order?')) return;
    try {
      await apiFetch(`/orders/${orderId}/items/${itemId}/cancel`, { method: 'PUT' });
      fetchOrders();
    } catch (error) {
      alert(error.message || 'Failed to cancel item');
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (orders.length === 0) return <div>You have no orders yet.</div>;

  return (
    <div className="orders-list">
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-card__header">
            <div>
              <span className="order-card__id">Order #{order.id.substring(0, 8)}</span>
              <span className="order-card__date">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="order-card__status-group">
              <span className={`order-status order-status--${order.status.toLowerCase()}`}>
                {order.status}
              </span>
              {order.status === 'PENDING' && (
                <button 
                  className="order-btn-cancel-all"
                  onClick={() => cancelOrder(order.id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
          
          <div className="order-card__items">
            {order.items.map(item => (
              <div key={item.id} className={`order-item ${item.status === 'CANCELLED' ? 'order-item--cancelled' : ''}`}>
                <div className="order-item__info">
                  <div className="order-item__img">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} />
                    ) : 'IMG'}
                  </div>
                  <div>
                    <h4>{item.product.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    {item.status === 'CANCELLED' && <span className="item-status-badge">Cancelled</span>}
                  </div>
                </div>
                <div className="order-item__actions">
                  <span className="order-item__price">${Number(item.price).toFixed(2)}</span>
                  {order.status === 'PENDING' && item.status !== 'CANCELLED' && (
                    <button 
                      className="order-btn-remove"
                      onClick={() => cancelItem(order.id, item.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-card__footer">
            <span>Total Amount:</span>
            <span className="order-card__total">${Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
