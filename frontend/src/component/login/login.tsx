import React, { useState } from 'react';
import { Form, Input, Button, message, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './login.css';

const LoginSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); 
  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', values, {withCredentials:true});
      const { token } = response.data;
      localStorage.setItem('token', token);
      message.success("You are successfully Logged In")
      navigate('/content'); 
    } catch (error) {
      console.error('Login error:', error);
      message.error('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpToggle = () => {
    setIsSignUp(!isSignUp); 
  };

  const handleSignUp = async (values: any) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/users/register', values);
      console.log(values)
      message.success('User registered successfully. Please log in.');
      setIsSignUp(false);
    } catch (error) {
      console.error('Signup error:', error);
      message.error('Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
      <Form
        name="loginForm"
        initialValues={{ remember: true }}
        onFinish={isSignUp ? handleSignUp : handleLogin}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address!' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter your email address" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            // Add custom password validation rules
            { min: 8, message: 'Password must be at least 8 characters!' },
            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
        </Form.Item>
        {isSignUp && (
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm your password" />
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            {isSignUp ? 'Sign Up' : 'Log In'}
          </Button>
        </Form.Item>
      </Form>

      <div className="forgot-password-link">
        <Button type="link" onClick={() => navigate('/forgot-password')}>
          Forgot Password?
        </Button>
      </div>

      {!isSignUp && (
        <div className="signup-toggle">
          <Button type="link" onClick={handleSignUpToggle}>
            {isSignUp ? 'Back to Login' : 'Sign Up'}
          </Button>
        </div>
      )}

      <div className="social-login">
        <Tooltip title="Login with Google">
          <Button type="default" icon={<GoogleOutlined />} style={{ marginRight: '8px' }} />
        </Tooltip>
        <Tooltip title="Login with Facebook">
          <Button type="default" icon={<FacebookOutlined />} />
        </Tooltip>
      </div>
    </div>
  );
};

export default LoginSignupPage;
