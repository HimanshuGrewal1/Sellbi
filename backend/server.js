import express from "express"
import dotenv from "dotenv"
import connectDB from "./src/DB/connectMongoDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./src/routes/auth.route.js";
import { logRequest } from "./src/middlewares/log.js";

const app = express();
dotenv.config()
app.use(logRequest);

const router=express.Router()

import systemRoutes from './src/routes/log.route.js';
app.use(systemRoutes);



const port=process.env.PORT || 8000
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.get("/",(req,res)=>{
    res.send("Server is ready")
})

app.use("/api/auth", authRoutes);

import productroute from "./src/routes/product.route.js"
import { Product } from "./src/models/product.model.js";
app.use("/api/market",productroute)

import cartroute from "./src/routes/cart.route.js"
app.use("/api/cart",cartroute)

import orderroute from "./src/routes/order.route.js"
app.use("/api/order",orderroute)

app.use("/IIT2024230/healthz", (req, res) => {
  res.status(200).send('Backend is Alive');
});

 connectDB().then(()=>{
    app.listen(port,()=>{
    console.log(`Server is runing at port ${port}`)
//     function generateRandomSku() {
//   return `SKU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
// }
//    Product.insertMany(
//  [
//   {
//     title: "Wireless Bluetooth Headphones",
//     actualPrice: 2999,
//     discount: 15,
//     stock: 120,
//     Seller: "66cf8acb5e9f8e4d8f9c1234",
//     Description: "Over-ear wireless headphones with noise cancellation and 30-hour battery life.",
//     category: "Electronics",
//     isFeatured: true,
//     sku: generateRandomSku(),  // ✅ random SKU
//     Review: [
//       {
//         user: "66cf8b1c5e9f8e4d8f9c5678",
//         rating: 5,
//         comment: "Amazing sound quality!",
//         createdAt: "2025-08-20T10:30:00Z"
//       },
//       {
//         user: "66cf8c7f5e9f8e4d8f9c9101",
//         rating: 4,
//         comment: "Battery life is great, but earcups get warm.",
//         createdAt: "2025-08-22T15:45:00Z"
//       }
//     ]
//   },
//   {
//     title: "Ergonomic Office Chair",
//     actualPrice: 8999,
//     discount: 20,
//     stock: 50,
//     Seller: "66cf8acb5e9f8e4d8f9c2233",
//     Description: "High back ergonomic office chair with lumbar support and breathable mesh.",
//     category: "Furniture",
//     isFeatured: false,
//     sku: generateRandomSku(),  // ✅ random SKU
//     Review: [
//       {
//         user: "66cf8b1c5e9f8e4d8f9c5678",
//         rating: 4,
//         comment: "Comfortable for long hours.",
//         createdAt: "2025-08-25T08:20:00Z"
//       }
//     ]
//   },
//   {
//     title: "Running Shoes",
//     actualPrice: 4999,
//     discount: 10,
//     stock: 200,
//     Seller: "66cf8acb5e9f8e4d8f9c4455",
//     Description: "Lightweight running shoes with breathable mesh and durable outsole.",
//     category: "Sports",
//     isFeatured: true,
//     sku: generateRandomSku(),  // ✅ random SKU
//     Review: [
//       {
//         user: "66cf8c7f5e9f8e4d8f9c9101",
//         rating: 5,
//         comment: "Perfect fit and very comfortable.",
//         createdAt: "2025-08-27T12:00:00Z"
//       }
//     ]
//   },
//   {
//     title: "Smart LED TV 43 Inch",
//     actualPrice: 24999,
//     discount: 18,
//     stock: 35,
//     Seller: "66cf8acb5e9f8e4d8f9c6677",
//     Description: "43-inch 4K Smart LED TV with HDR10 and built-in streaming apps.",
//     category: "Electronics",
//     isFeatured: true,
//     sku: generateRandomSku(),  // ✅ random SKU
//     Review: []
//   }
// ]
// )

})}

 )