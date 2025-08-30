import { Product } from "../models/product.model.js";
import { User } from "../models/user.modle.js";


export const getProducts = async (req, res) => {
   try {
    let { search, catogry,page, limit } = req.query;

   
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" }; 
    }
    if(catogry){
        query.catogry=catogry
    }

  
    const skip = (page - 1) * limit;
   
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
        .sort({ createdAt: -1 }); ;

  
     const total = await Product.countDocuments(query);

   
    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: products,
    });

    
  } catch (err) {
    console.error("Error in GETProduct controller:", err);
    return res.status(500).json({ error: err.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    console.log(req.params.id);
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const createProduct = async (req, res) => {
  try {
   
    const user = await User.findById(req.userId)
     
    if(user.Role!='seller'){
     
        return res.status(400).json({ success: false, message: "You are not a seller " });
    }

    const product = new Product({...req.body,Seller:req.userId});
    await product.save();
    res.status(201).json(product);
  } catch (err) {
   
    res.status(400).json({ error: err.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
  { _id: req.params.id, Seller: req.userId }, 
  req.body, 
  { new: true }
);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
   const product = await Product.findOneAndDelete({ _id: req.params.id, Seller: req.userId });

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}