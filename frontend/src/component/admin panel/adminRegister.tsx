import  { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    console.log('Form values:', values);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/users/admin-register', values, {withCredentials:true});
      message.success('User registered successfully as admin');
      console.log('New user:', response.data.user);
      navigate('/admin-panel');
    } catch (error) {
      console.error('Error registering user as admin:', error);
      message.error('Failed to register user as admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-form-container">
      <Form name="adminRegistrationForm" onFinish={onFinish} className="registration-form">
        <h1 className="registration-form-title">Admin Registration</h1>
        <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }]} className="registration-form-item">
          <Input type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]} className="registration-form-item">
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item name="secretKey" rules={[{ required: true, message: 'Please enter your secret key' }]} className="registration-form-item">
          <Input.Password placeholder="Secret Key" />
        </Form.Item>
        <Form.Item name="reference" rules={[{ required: true, message: 'Please enter the reference email' }]} className="registration-form-item">
          <Input type="email" placeholder="Reference Email (Admin)" />
        </Form.Item>
        <Form.Item className="registration-form-item">
          <Button type="primary" htmlType="submit" loading={loading} className="registration-form-button">Register</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminRegistrationForm;
