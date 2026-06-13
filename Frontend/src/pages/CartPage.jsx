import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Breadcrumb from '../components/layout/Breadcrumb';
import Button from '../components/ui/Button';
import './CartPage.css';

export default function CartPage() {
  const { cartItems, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Validate stock
    for (const item of cartItems) {
      if (item.quantity > item.stockQuantity) {
        alert(`Cannot checkout. Your cart has ${item.quantity} of ${item.name}, but only ${item.stockQuantity} are available in stock.`);
        return;
      }
      if (item.stockQuantity === 0) {
        alert(`Cannot checkout. ${item.name} is currently out of stock.`);
        return;
      }
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <Breadcrumb />
      
      <div className="container">
        <div className="cart-page__inner">
          
          <div className="cart-table">
            <div className="cart-table__header">
              <div className="cart-table__col">Product</div>
              <div className="cart-table__col">Price</div>
              <div className="cart-table__col">Quantity</div>
              <div className="cart-table__col">Subtotal</div>
            </div>
            
            <div className="cart-table__body">
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div key={item.id} className="cart-table__row">
                    <div className="cart-table__col cart-table__col--product">
                      <div className="cart-table__product-img">
                        <button 
                          className="cart-table__remove-btn"
                          onClick={() => updateQuantity(item.id, 0)}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                            <line x1="2" y1="2" x2="8" y2="8" />
                            <line x1="8" y1="2" x2="2" y2="8" />
                          </svg>
                        </button>
                        <div className="cart-table__img-placeholder">Image</div>
                      </div>
                      <span className="cart-table__product-name">{item.name}</span>
                    </div>
                    <div className="cart-table__col">${Number(item.price).toFixed(2)}</div>
                    <div className="cart-table__col">
                      <input 
                        type="number" 
                        className="cart-table__qty-input"
                        min="1"
                        max={item.stockQuantity}
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          if (val > item.stockQuantity) {
                            alert(`Only ${item.stockQuantity} available.`);
                            updateQuantity(item.id, item.stockQuantity);
                          } else {
                            updateQuantity(item.id, val);
                          }
                        }}
                      />
                    </div>
                    <div className="cart-table__col">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="cart-table__empty">Your cart is empty.</div>
              )}
            </div>
          </div>
          
          <div className="cart-page__actions">
            <Button variant="secondary" onClick={() => window.history.back()}>Return To Shop</Button>
            <Button variant="secondary">Update Cart</Button>
          </div>
          
          <div className="cart-page__footer">
            <div className="cart-page__coupon">
              <input type="text" className="input" placeholder="Coupon Code" />
              <Button>Apply Coupon</Button>
            </div>
            
            <div className="cart-page__total-box">
              <h3 className="cart-page__total-title">Cart Total</h3>
              
              <div className="cart-page__total-row">
                <span>Subtotal:</span>
                <span>${Number(cartTotal).toFixed(2)}</span>
              </div>
              <div className="cart-page__total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="cart-page__total-row cart-page__total-row--final">
                <span>Total:</span>
                <span>${Number(cartTotal).toFixed(2)}</span>
              </div>
              
              <div className="cart-page__checkout-btn">
                <Button fullWidth onClick={handleCheckout}>Proceed to checkout</Button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
