import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './content.css';
import axios from 'axios';

export interface Product {
  stock: number;
  description: string ;
  id: number;
  title: string;
  brand: string;
  category: string;
  thumbnail: string;
  price: number;
  discountPrice: number;
  inWishlist: boolean;
}

export interface ContentPageProps {
  addToCart: (product: Product) => void;
  searchTerm: string;
}

const ContentPage: React.FC<ContentPageProps> = ({ addToCart, searchTerm }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'http://localhost:3000/api/products';

        if (searchTerm) {
          url += `/search?q=${searchTerm}`;
        }
        const response = await axios.get(url);

        if (!response.data) {
          throw new Error('Failed to fetch products');
        }

        const data: Product[] = response.data;

        const initializedProducts = data.map((product: Product) => ({
          ...product,
          inWishlist: false,
        }));

        setProducts(initializedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        message.error('Failed to fetch products. Please try again later.');
      }
    };

    fetchData();
  }, [searchTerm]);

  
  const handleAddToCart = async (product: Product) => {
    try {
      if (product.stock === 0) {
        message.error('Sorry, the product you are trying to add is out of stock. Please try again later.');
        return;
      }

      const response = await axios.post('http://localhost:3000/api/cart/add', {
        productId: product.id,
        quantity: 1
      }, {
        withCredentials: true
      });

      if (!response.data) {
        throw new Error('Failed to add product to cart');
      }

      message.success(`${product.title} added to cart`);
      addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error('Failed to add product to cart. Please try again.');
    }
  };

  const renderStockMessage = (product: Product) => {
    if (product.stock === 0) {
      return <p className="out-of-stock">Out of Stock</p>;
    }
    return null;
  };

  // Group products by category
  const groupedProducts: { [key: string]: Product[] } = {};
  products.forEach((product) => {
    if (!groupedProducts[product.category]) {
      groupedProducts[product.category] = [];
    }
    groupedProducts[product.category].push(product);
  });

  return (
    <div className="content">
      <h1>Products</h1>
      {Object.entries(groupedProducts).map(([category, productsInCategory], index) => (
        <React.Fragment key={category}>
          <h2>{category}</h2>
          <div className="productGrid">
            {productsInCategory.map((product) => (
              <div key={product.id} className="productCard">
                <div className="productImage">
                  <img src={product.thumbnail} alt={product.title} />
                </div>
                <div className="productDetails">
                  <h3>{product.title}</h3>
                  <p>Brand: {product.brand}</p>
                  <p>Description: {product.description}</p>
                  <p>Price: ${product.price}</p>
                  <p>Discount Price: ${(product.price - product.price * product.discountPrice) / 100}</p>
                  {renderStockMessage(product)}
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    className="addToCartButton"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0} 
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {index !== Object.entries(groupedProducts).length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ContentPage;
