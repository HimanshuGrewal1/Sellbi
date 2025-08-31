import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controllers/cart.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, getCart);
router.post('/add', verifyToken, addToCart);
router.put('/update', verifyToken, updateCartItem);
router.delete('/remove', verifyToken, removeFromCart);

export default router;