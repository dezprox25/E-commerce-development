import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiFetch from '../utils/api';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from backend if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchWishlist = async () => {
        try {
          const data = await apiFetch('/wishlist');
          // Map backend wishlist format {id, product: {...}} to frontend format {...product, wishlistItemId: id}
          const formattedWishlist = data.map(item => ({
            ...item.product,
            wishlistItemId: item.id
          }));
          setWishlistItems(formattedWishlist);
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        }
      };
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      alert('Please log in to add items to your wishlist.');
      return;
    }

    try {
      const item = await apiFetch('/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id })
      });
      
      setWishlistItems(prev => {
        if (prev.find(p => p.id === product.id)) return prev;
        return [...prev, { ...item.product, wishlistItemId: item.id }];
      });
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      const itemToRemove = wishlistItems.find(item => item.id === productId);
      if (itemToRemove && itemToRemove.wishlistItemId) {
        try {
          await apiFetch(`/wishlist/${itemToRemove.wishlistItemId}`, { method: 'DELETE' });
        } catch (error) {
          console.error('Failed to remove from wishlist:', error);
        }
      }
    }
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
