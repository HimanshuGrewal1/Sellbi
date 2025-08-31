import { Cart } from "../models/Cart.model.js";
import { Order } from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const { items, price,CartId } = req.body;
    const newOrder = new Order({
      user: req.userId,
      items,
        price
    });
    await newOrder.save();
    Cart.findByIdAndDelete(CartId).then(()=>{
        console.log("Cart cleared after order creation");
    }).catch((err)=>{
        console.error("Error clearing cart:", err);
    });
    res.status(201).json(newOrder);
  }
    catch (error) {
    res.status(500).json({ message: 'Server error', error });
    }
}

export const getOrders=async(req,res)=>{
    try {
        const orders = await Order.find({ user: req.userId }).populate('items.product');
        res.status(200).json(orders);

        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}