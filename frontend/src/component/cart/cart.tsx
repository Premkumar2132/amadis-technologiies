import React, { useState } from 'react';
import { Button, message } from 'antd';
import './cart.css';

export interface ProductInCart {
  id: number;
  title: string;
  brand: string;
  category: string;
  thumbnail: string;
  price: number;
  discountPrice: number;
  quantity: number;
}
interface CartPageProps {
  cart: ProductInCart[];
  removeFromCart: (productId: number) => void; 
}

const CartPage: React.FC<CartPageProps> = ({ cart,removeFromCart }) => {
  const [updatedCart, setUpdatedCart] = useState<ProductInCart[]>(cart);

  const handleRemoveFromCart = (productId: number) => {
    fetch(`http://localhost:3000/api/cart/remove/${productId}`, {
      method: 'DELETE',
      credentials:'include'
    })
    .then(response => { 
      if (response.ok) {
        message.success('Product removed from cart successfully');
        removeFromCart(productId); 
        setUpdatedCart(updatedCart.filter(product => product.id !== productId));
      } else {
        throw new Error('Failed to remove product from cart');
      }
    })
    .catch(error => {
      console.error('Error removing from cart:', error);
      message.error('Failed to remove product from cart');
    });
  };


  const calculateTotalPrice = () => {
    let totalPrice = 0;
    let totalDiscount = 0;

    updatedCart.forEach((product: ProductInCart) => {
      totalPrice += product.price * product.quantity;
      totalDiscount += ((product.price * product.discountPrice) / 100) * product.quantity;
    });

    return { totalPrice, totalDiscount };
  };


  const handleIncreaseQuantity = (productId: number) => {
    const updatedCartCopy = updatedCart.map((product: ProductInCart) =>
      product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
    );
    setUpdatedCart(updatedCartCopy);
  };

  const handleDecreaseQuantity = (productId: number) => {
    const updatedCartCopy = updatedCart.map((product: ProductInCart) =>
      product.id === productId && product.quantity > 1 ? { ...product, quantity: product.quantity - 1 } : product
    );
    setUpdatedCart(updatedCartCopy);
  };

  const { totalPrice, totalDiscount } = calculateTotalPrice();

  return (
    <div className="cart">
      <h1>Cart</h1>
      <div className="cart-items">
        {updatedCart.map((product: ProductInCart) => (
          <div key={product.id} className="cart-item">
            <img src={product.thumbnail} alt={product.title} />
            <div className="item-details">
              <h3>{product.title}</h3>
              <p>Brand: {product.brand}</p>
              <p>Price: ${product.price}</p>
              <div>
                <Button onClick={() => handleIncreaseQuantity(product.id)}>+</Button>
                <p>Quantity: {product.quantity}</p>
                <Button onClick={() => handleDecreaseQuantity(product.id)}>-</Button>
              </div>
              <div>
                <Button onClick={() => handleRemoveFromCart(product.id)}>Remove</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Cart Summary</h2>
        <p>Total Cost: ${totalPrice}</p>
        <p>Total Discount: ${totalDiscount}</p>
        <p>Total Price: ${totalPrice - totalDiscount}</p>
      </div>
    </div>
  );
};

export default CartPage;
