import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import apiFetch from '../utils/api';

const CartContext = createContext();

const GUEST_CART_KEY = 'guest_cart';

/**
 * Read the guest cart from localStorage.
 * Returns an array of product objects with quantity.
 */
function getGuestCart() {
  try {
    const saved = localStorage.getItem(GUEST_CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Write the guest cart to localStorage.
 */
function saveGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

/**
 * Clear the guest cart from localStorage.
 */
function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY);
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const prevAuthRef = useRef(isAuthenticated);
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // -------------------------------------------------------
  // Handle auth state transitions (login / logout)
  // -------------------------------------------------------
  useEffect(() => {
    const prevAuth = prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;

    if (!prevAuth && isAuthenticated) {
      // --- User just LOGGED IN ---
      handleLoginMerge();
    } else if (prevAuth && !isAuthenticated) {
      // --- User just LOGGED OUT ---
      // Don't leak user's cart to guest session — start empty
      setCartItems([]);
      // Guest cart was already cleared on login, so guest starts fresh
    } else if (isAuthenticated) {
      // --- Already authenticated (e.g., page reload) ---
      fetchBackendCart();
    } else {
      // --- Guest (not authenticated, no transition) ---
      setCartItems(getGuestCart());
    }
  }, [isAuthenticated]);

  /**
   * On login: merge guest cart items into the backend, clear guest cart,
   * then fetch the full merged cart from backend.
   */
  async function handleLoginMerge() {
    setLoading(true);
    try {
      const guestItems = getGuestCart();

      if (guestItems.length > 0) {
        // Merge guest items into user's backend cart
        const mergePayload = guestItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }));

        const mergedData = await apiFetch('/cart/merge', {
          method: 'POST',
          body: JSON.stringify({ items: mergePayload })
        });

        // Format the merged cart from backend
        const formattedCart = mergedData.map(item => ({
          ...item.product,
          cartItemId: item.id,
          quantity: item.quantity
        }));
        setCartItems(formattedCart);
      } else {
        // No guest items — just fetch the existing backend cart
        await fetchBackendCart();
      }

      // Clear guest cart after successful merge
      clearGuestCart();
    } catch (error) {
      console.error('Failed to merge carts:', error);
      // Fallback: just fetch backend cart
      await fetchBackendCart();
      clearGuestCart();
    } finally {
      setLoading(false);
    }
  }

  /**
   * Fetch the authenticated user's cart from the backend.
   */
  async function fetchBackendCart() {
    try {
      const data = await apiFetch('/cart');
      const formattedCart = data.map(item => ({
        ...item.product,
        cartItemId: item.id,
        quantity: item.quantity
      }));
      setCartItems(formattedCart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  }

  // -------------------------------------------------------
  // Sync guest cart to localStorage whenever it changes
  // -------------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated) {
      saveGuestCart(cartItems);
    }
  }, [cartItems, isAuthenticated]);

  // -------------------------------------------------------
  // Cart Operations
  // -------------------------------------------------------
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
      // Guest: store locally only
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

  const clearCart = async () => {
    setCartItems([]);
    if (!isAuthenticated) {
      saveGuestCart([]);
    }
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity, 0
  );

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, loading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
