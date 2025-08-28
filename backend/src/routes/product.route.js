import express from "express"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controllers.js"
import { verifyToken } from "../middlewares/verifyToken.js";



const router = express.Router();

router.get("/products",getProducts)
router.get("/product/:id",getProductById)
router.post("/add",verifyToken,createProduct)
router.put("/update/:id",updateProduct)
router.delete("/delete/:id",deleteProduct)

export default router;