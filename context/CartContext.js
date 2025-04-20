import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : { items: [], total: 0 };
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return { items: [], total: 0 };
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (product) => {
    if (!product) return;

    setCart((prevCart) => {
      const currentCart = prevCart || { items: [], total: 0 };
      const currentItems = currentCart.items || [];

      const existingItemIndex = currentItems.findIndex(
        (item) => item.id === product.id
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = [...currentItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + (product.quantity || 1),
        };
      } else {
        newItems = [...currentItems, { ...product, quantity: product.quantity || 1 }];
      }

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return { items: newItems, total: newTotal };
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.id !== productId);
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { items: newItems, total: newTotal };
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { items: newItems, total: newTotal };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
