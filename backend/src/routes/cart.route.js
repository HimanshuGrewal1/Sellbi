import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controllers/cart.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, getCart);
router.post('/add', verifyToken, addToCart);
router.put('/update/:itemId', verifyToken, updateCartItem);
router.delete('/remove/:itemId', verifyToken, removeFromCart);

export default router;