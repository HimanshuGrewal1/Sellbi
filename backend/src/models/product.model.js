import mongoose from "mongoose";
import crypto from "crypto"

const ProductSchema=new mongoose.Schema({
        title:{
            type:String,
            required:true
        },
        actualPrice:{
            type:Number,
            required:true
        },
        discount:{
            type:Number,
        },
        stock:{
            type:Number,
            required:true,
        },
        Seller:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
        Description:{
            type:String,
            required:true,
        },
        sku: { 
            type: String, 
            unique: true
        },
        category: { 
            type: String
         },
           isFeatured: { 
            type: Boolean, 
            default: false 
        },
        Review:[{

             user: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', required: true 
            },
              rating: { type: Number, min: 1, max: 5, required: true },
              comment: { type: String },
              createdAt: { type: Date, default: Date.now }
        }
        ]

},{
    timestamps:true
})

ProductSchema.pre('save', function(next) {
  if (!this.sku) {
    const seed = process.env.SEED || 'GHW25-XXXX';
    const checksum = crypto.createHash('sha256').update(seed + this.title).digest('hex').slice(0,15);
    this.sku = `SKU-${checksum}`;
  }
  next();
});

export const Product=mongoose.model("Product",ProductSchema)