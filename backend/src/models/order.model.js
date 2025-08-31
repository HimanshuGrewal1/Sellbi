import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
     required: true },

  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId
        , ref: 'Product'
     },
      quantity: { 
        type: Number,
         default: 1,
        min: 1
     },
    }
  ],
  price: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', OrderSchema);
