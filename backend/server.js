import express from "express"
import dotenv from "dotenv"
import connectDB from "./src/DB/connectMongoDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./src/routes/auth.route.js";

const app = express();
dotenv.config()


const port=process.env.PORT || 8000
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.get("/",(req,res)=>{
    res.send("Server is ready")
})

app.use("/api/auth", authRoutes);

import productroute from "./src/routes/product.route.js"
app.use("/api/market",productroute)

 connectDB().then(()=>{
    app.listen(port,()=>{
    console.log(`Server is runing at port ${port}`)
   

})}

 )