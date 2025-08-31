import express from "express"
import { addComment, createProduct, deleteProduct, getProductById, getProducts, getProductsOfSeller, updateProduct } from "../controllers/product.controllers.js"
import { verifyToken } from "../middlewares/verifyToken.js";



const router = express.Router();

router.get("/products",getProducts)
router.get("/product/:id",getProductById)
router.post("/add",verifyToken,createProduct)
router.put("/update/:id",updateProduct)
router.delete("/delete/:id",verifyToken,deleteProduct)
router.post("/comment/:id",verifyToken,addComment)
router.get("/seller/products",verifyToken,getProductsOfSeller)


export default router;