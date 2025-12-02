import React, { createContext, useState, useContext, useEffect } from 'react';
import { ajaxRequest } from '../utils/ajax';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
            setLoading(false);
        }
    }, [user]);

    const fetchCart = () => {
        setLoading(true);
        ajaxRequest('GET', '/api/cart', null, (error, data) => {
            if (!error && data) {
                const items = data.items.map(item => {
                    let itemPrice = item.product.price;
                    if (item.product.onSale && item.product.discountPercentage) {
                        itemPrice = item.product.price * (1 - item.product.discountPercentage / 100);
                    }

                    return {
                        id: item.product.id,
                        cartItemId: item.id,
                        name: item.product.name,
                        description: item.product.description,
                        price: itemPrice,
                        originalPrice: item.product.price,
                        discountPercentage: item.product.discountPercentage,
                        onSale: item.product.onSale,
                        image: item.product.image,
                        quantity: item.quantity,
                        customization: item.customization ? JSON.parse(item.customization) : {}
                    };
                });
                setCartItems(items);
            }
            setLoading(false);
        });
    };

    const addToCart = (product, quantity, options = {}) => {
        if (!user) {
            return false;
        }

        ajaxRequest('POST', '/api/cart/items',
            { productId: product.id, quantity: parseInt(quantity), customization: options },
            (error, data) => {
                if (!error) {
                    fetchCart();
                } else {
                    console.error('Error adding item to cart');
                }
            }
        );
        return true;
    };

    const removeFromCart = (itemId) => {
        const item = cartItems.find(i => i.id === itemId);
        if (!item || !item.cartItemId) return;

        ajaxRequest('DELETE', `/api/cart/items/${item.cartItemId}`,
            null,
            (error) => {
                if (!error) {
                    setCartItems(prevItems => prevItems.filter(i => i.id !== itemId));
                } else {
                    alert('Error removing item from cart');
                }
            }
        );
    };

    const updateCartItemQuantity = (itemId, newQuantity) => {
        const item = cartItems.find(i => i.id === itemId);
        if (!item || !item.cartItemId) return;

        if (newQuantity < 1) return;

        ajaxRequest('PUT', `/api/cart/items/${item.cartItemId}`,
            { quantity: parseInt(newQuantity) },
            (error, data) => {
                if (!error) {
                    setCartItems(prevItems => prevItems.map(i =>
                        i.id === itemId ? { ...i, quantity: parseInt(newQuantity) } : i
                    ));
                } else {
                    console.error('Error updating quantity');
                }
            }
        );
    };

    const clearCart = () => {
        if (!user) {
            setCartItems([]);
            return;
        }

        ajaxRequest('DELETE', '/api/cart', null, (error) => {
            if (!error) {
                setCartItems([]);
            } else {
                alert('Error clearing cart');
            }
        });
    };

    const getCartCount = () => {
        return cartItems.length;
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            getCartCount,
            getCartTotal,
            loading,
            refreshCart: fetchCart,
            updateCartItemQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
};
