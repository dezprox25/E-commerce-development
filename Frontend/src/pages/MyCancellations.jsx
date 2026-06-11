import { useState, useEffect } from 'react';
import apiFetch from '../utils/api';

export default function MyCancellations() {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCancellations();
  }, []);

  const fetchCancellations = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/orders/my-cancellations');
      setCancellations(data);
    } catch (error) {
      console.error('Failed to fetch cancellations', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading cancellations...</div>;
  if (cancellations.length === 0) return <div>You have no cancelled orders or items.</div>;

  return (
    <div className="orders-list">
      {cancellations.map(order => {
        const fullyCancelled = order.status === 'CANCELLED';
        // Only show items that are cancelled, or all items if the whole order is cancelled
        const displayItems = fullyCancelled ? order.items : order.items.filter(item => item.status === 'CANCELLED');

        return (
          <div key={order.id} className="order-card order-card--cancelled">
            <div className="order-card__header">
              <div>
                <span className="order-card__id">Order #{order.id.substring(0, 8)}</span>
                <span className="order-card__date">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="order-card__status-group">
                <span className="order-status order-status--cancelled">
                  {fullyCancelled ? 'FULLY CANCELLED' : 'PARTIALLY CANCELLED'}
                </span>
              </div>
            </div>
            
            <div className="order-card__items">
              {displayItems.map(item => (
                <div key={item.id} className="order-item order-item--cancelled">
                  <div className="order-item__info">
                    <div className="order-item__img">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} />
                      ) : 'IMG'}
                    </div>
                    <div>
                      <h4>{item.product.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="order-item__actions">
                    <span className="order-item__price">${Number(item.price).toFixed(2)}</span>
                    <span className="item-status-badge">Refunded</span>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        );
      })}
    </div>
  );
}
