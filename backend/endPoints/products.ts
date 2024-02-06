import express, { Request, Response } from 'express';
import axios from 'axios';
import { Product } from '../models/models';
import { authorizeAdmin } from './authentication';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;

    if (!searchTerm) {
      const response = await axios.get('https://dummyjson.com/products');
      const allProducts = response.data.products;

      for (const productData of allProducts) {
        const existingProduct = await Product.findByPk(productData.id);
        if (existingProduct) {
          await existingProduct.update(productData);
        } else {
          await Product.create(productData);
        }
      }
      return res.json(allProducts);
    }
    const response = await axios.get(`https://dummyjson.com/products/search?q=${searchTerm}`);
    const data = response.data.products;

    const filteredProducts = data.filter((product: any) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return res.json(filteredProducts);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/add', authorizeAdmin,async (req: Request, res: Response) => {
  try {
    const { title, category, brand, price, thumbnail, discountPercentage } = req.body;
    if (!title || !category || !brand || !price || !thumbnail || !discountPercentage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProduct = await Product.create({
      title,
      category,
      brand,
      price,
      thumbnail,
      discountPercentage,
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/update/:id',authorizeAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: parseInt(id, 10) },
    });
    if (updated) {
      const updatedProduct = await Product.findByPk(id);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});


export default router;
