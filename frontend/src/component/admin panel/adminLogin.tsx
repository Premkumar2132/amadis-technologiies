import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/users/admin-login', values);
      const isAdmin = response.data.isAdmin; 
      if (isAdmin) {
        message.success('Login successful');
        navigate('/admin-panel');
      } else {
        message.error('You are not an admin');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      message.error('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <h1>Admin Login</h1>
      <Form name="adminLoginForm" onFinish={onFinish} className="registration-form">
        <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>Login</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminLoginPage;
