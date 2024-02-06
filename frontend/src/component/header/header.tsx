import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Input from 'antd/es/input/Input';
import logo from './cart-logo.png';
import { UserOutlined, ShoppingCartOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import './header.css';

interface HeaderProps {
  onSearchChange: (term: string) => void; 
  isAuthenticated: boolean; 
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange, isAuthenticated, onLogout}) => { // Remove searchTerm and onSearchSubmit from props
  const navigate = useNavigate();

  const handleAdminRegister = () => {
    navigate('/admin-register');
  };

  const handleCart = () => {
    navigate('/cart');
  };

  const handleLogout = () => {
    onLogout(); 
    navigate('/'); 
  };

  return (
    <header className="header">
      <div className="logoContainer">
        <img src={logo} alt="Logo" />
      </div>

      <div className="searchContainer">
        <Input
          type="text"
          placeholder="Search products..."
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {isAuthenticated && (
        <div className="iconContainer logout" onClick={handleLogout}>
        <LoginOutlined className="icon" />
        </div>
      )}
      
      {!isAuthenticated && (
        <NavLink to="/" className="iconContainer login" >
          <LogoutOutlined className="icon" />
        </NavLink>
      )}
      <div className="iconContainer user" onClick={handleAdminRegister}>
        <UserOutlined className="icon" />
      </div>
      <div className="iconContainer cart" onClick={handleCart}>
        <ShoppingCartOutlined className="icon" />
      </div>
    </header>
  );
};

export default Header;
