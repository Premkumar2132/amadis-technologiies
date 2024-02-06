// cartRoutes.ts
import express, { Request, Response } from 'express';
import { Cart, Product } from '../models/models';
import { authenticateUser } from './authentication'; 

const router = express.Router();

router.post('/add', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const cartItem = await Cart.findOne({ where: { userId, productId } });

    if (cartItem) {
      await cartItem.update({ quantity: cartItem.quantity + quantity });
    } else {
      await Cart.create({ userId, productId, quantity });
    }

    res.status(201).json({ success: true, message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Failed to add product to cart' });
  }
});

router.delete('/remove/:productId', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    await Cart.destroy({ where: { userId, productId } });
    res.status(200).json({ success: true, message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, message: 'Failed to remove product from cart' });
  }
});

router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const cartItems = await Cart.findAll({ where: { userId }, include: [Product] });
    res.status(200).json({ success: true, message: 'Cart items fetched successfully', cartItems });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cart items' });
  }
});

export default router;
