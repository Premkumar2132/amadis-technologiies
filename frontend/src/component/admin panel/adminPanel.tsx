import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Space, message, Modal } from 'antd';
import axios from 'axios';
import './admin-panel.css';

const AdminPanel: React.FC = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState<boolean>(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products');
    }
  };

  const onFinish = async (values: any) => {
    try {
      // Convert string values to numbers
      values.price = parseFloat(values.price);
      values.discountPrice = parseFloat(values.discountPrice);
      values.stock = parseInt(values.stock);

      if (editProduct) {
        const updatedProducts = products.map(product =>
          product.id === editProduct.id ? { ...product, ...values } : product
        );
        await axios.put(`http://localhost:3000/api/products/update/${editProduct.id}`, values);
        message.success('Product updated successfully');
        setProducts(updatedProducts);
        setEditProduct(null);
      } else {
        const response = await axios.post('http://localhost:3000/api/products/add', values);
        const newProduct = response.data;
        setProducts([...products, newProduct]);
        message.success('Product added successfully');
      }
      form.resetFields();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
      message.error('Failed to save product');
    }
  };

  const handleEdit = (record: any) => {
    setEditProduct(record);
    setShowForm(true);
    form.setFieldsValue(record);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/products/delete/${deleteProductId}`);
      setProducts(products.filter(product => product.id !== deleteProductId));
      message.success('Product deleted successfully');
      setDeleteProductId(null);
      setConfirmDeleteVisible(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_text: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" onClick={() => { setConfirmDeleteVisible(true); setDeleteProductId(record.id) }} style={{ color: 'red' }}>Remove</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-panel-container">
      {showForm && (
        <div className="registration-form-container">
          <h1>{editProduct ? 'Edit Product' : 'Add Product'}</h1>
          <Form form={form} onFinish={onFinish} layout="vertical" className="registration-form">
            <Form.Item key="title" name="title" label="Title" rules={[{ required: true, message: 'Please enter the title' }]}>
              <Input />
            </Form.Item>
            <Form.Item key="description" name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item key="price" name="price" label="Price" rules={[{ required: true, message: 'Please enter the price' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item key="discountPrice" name="discountPrice" label="Discount Percentage">
              <Input type="number" />
            </Form.Item>
            <Form.Item key="stock" name="stock" label="Stock">
              <Input type="number" />
            </Form.Item>
            <Form.Item key="brand" name="brand" label="Brand">
              <Input />
            </Form.Item>
            <Form.Item key="category" name="category" label="Category">
              <Input />
            </Form.Item>
            <Form.Item key="thumbnail" name="thumbnail" label="Thumbnail URL">
              <Input />
            </Form.Item>
            <Form.Item key="submit">
              <Button type="primary" htmlType="submit">{editProduct ? 'Update Product' : 'Add Product'}</Button>
            </Form.Item>
          </Form>
        </div>
      )}

      <h1>Products</h1>
      <Button type="primary" onClick={() => { setShowForm(true); setEditProduct(null); form.resetFields(); }} style={{ marginBottom: '16px' }}>Add New Product</Button>
      <Table columns={columns} dataSource={products.map(product => ({ ...product, key: product.id }))} />


      <Modal
        title="Confirm Delete"
        open={confirmDeleteVisible}   
        onOk={handleDelete}
        onCancel={() => { setConfirmDeleteVisible(false); setDeleteProductId(null); }}
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </div>
  );
};

export default AdminPanel;
