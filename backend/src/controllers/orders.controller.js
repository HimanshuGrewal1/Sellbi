import { sendOrderConfirmationEmail } from "../Email/emails.js";
import { Cart } from "../models/Cart.model.js";
import { Order } from "../models/order.model.js";
import crypto from 'crypto';
import { User } from "../models/user.modle.js";

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
       
    }).catch((err)=>{
        console.error("Error clearing cart:", err);
    });
    const user = await User.findById(req.userId);
   await sendOrderConfirmationEmail(user.email, newOrder).catch(err => {
      console.error("Error sending order confirmation email:", err);
    });
    const responseBody = JSON.stringify(newOrder);


    const secret = process.env.SEED; 
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(responseBody);
    const signature = hmac.digest('base64'); 


    res.set('X-Signature', signature);

   
    res.status(201).send(responseBody);
   
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