import express from "express"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controllers";
import { verifyToken } from "../middlewares/verifyToken";



const router = express.Router();

router.get("/products",getProducts)
router.get("/product/:id",getProductById)
router.post("/add",verifyToken,createProduct)
router.update("/update/:id",updateProduct)
router.delete("/delete/:id",deleteProduct)