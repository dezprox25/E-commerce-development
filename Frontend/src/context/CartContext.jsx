import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiFetch from '../utils/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Load cart from backend if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchCart = async () => {
        try {
          const data = await apiFetch('/cart');
          // Map backend cart format {id, quantity, product: {...}} to frontend format {...product, cartItemId: id, quantity}
          const formattedCart = data.map(item => ({
            ...item.product,
            cartItemId: item.id,
            quantity: item.quantity
          }));
          setCartItems(formattedCart);
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      };
      fetchCart();
    }
  }, [isAuthenticated]);

  // Sync to local storage for guests, or as a backup
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const item = await apiFetch('/cart', {
          method: 'POST',
          body: JSON.stringify({ productId: product.id, quantity })
        });
        
        setCartItems(prev => {
          const existing = prev.find(p => p.id === product.id);
          if (existing) {
            return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p);
          }
          return [...prev, { ...item.product, cartItemId: item.id, quantity: item.quantity }];
        });
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    } else {
      // Guest logic
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      const itemToRemove = cartItems.find(item => item.id === productId);
      if (itemToRemove && itemToRemove.cartItemId) {
        try {
          await apiFetch(`/cart/${itemToRemove.cartItemId}`, { method: 'DELETE' });
        } catch (error) {
          console.error('Failed to remove from cart:', error);
        }
      }
    }
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (isAuthenticated) {
      const itemToUpdate = cartItems.find(item => item.id === productId);
      if (itemToUpdate && itemToUpdate.cartItemId) {
        try {
          await apiFetch(`/cart/${itemToUpdate.cartItemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
          });
        } catch (error) {
          console.error('Failed to update cart quantity:', error);
        }
      }
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    // If backend clearing is needed, would add it here. For checkout it usually deletes after order.
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
