import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const NewPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSetNewPassword = async (values: any) => {
    setLoading(true);
    try {
      // Simulate API call to set new password
      // Replace this with your actual API call
      message.success('Password updated successfully!');
      navigate('/login'); // Redirect to login page after setting new password
    } catch (error) {
      console.error('Password update error:', error);
      message.error('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-password-container">
      <h1>Set New Password</h1>
      <Form
        name="newPasswordForm"
        initialValues={{ remember: true }}
        onFinish={handleSetNewPassword}
      >
        <Form.Item
          name="newPassword"
          rules={[
            { required: true, message: 'Please input your new password!' },
            // Add custom password validation rules for new password
            { min: 8, message: 'New password must be at least 8 characters!' },
            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, message: 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter your new password" />
        </Form.Item>
        <Form.Item
          name="confirmNewPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("The passwords don't match! Please enter the same password."));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm your new password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Set New Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewPasswordPage;
