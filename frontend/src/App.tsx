import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Header from './component/header/header';
import ContentPage  from './component/content/content';
import LoginSignupPage from './component/login/login';
import NewPasswordPage from './component/login/newPassword';
import CartPage, { ProductInCart } from './component/cart/cart';
import AdminPanel from './component/admin panel/adminPanel'; 
import './App.css';
import AdminLogin from './component/admin panel/adminLogin';
import AdminRegistrationForm from './component/admin panel/adminRegister';

function App() {
  const [cart, setCart] = useState<ProductInCart[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term); 
  };

  const addToCart = (product: ProductInCart) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
     const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }
  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
  };
  const handleLogout = () => {
    setIsAuthenticated(true); 
  };

  return (
    <Router> 
      <Routes>
        <Route path="/content" element={<>
          <Header onSearchChange={handleSearchChange} isAuthenticated={isAuthenticated} onLogout={handleLogout}/>
          <ContentPage addToCart={addToCart} searchTerm={searchTerm} /></>} />
        <Route path="/" element={<LoginSignupPage />} />
        <Route path="/forgot-password" element={<NewPasswordPage />} />
        <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegistrationForm/>}/>
        <Route path="/admin-panel" element={<AdminPanel />} /> 
      </Routes>
    </Router>
  );
}

export default App;