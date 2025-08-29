import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Container,
  Alert,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  IconButton,
  useTheme,
  FormHelperText
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    actualPrice: "",
    discount: "",
    category: "",
    stock: "",
  });
  
  const [images, setImages] = useState([])
  const [URL,SetURL]=useState([])
  const [errors, setErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: "" })

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Sports & Fitness",
    "Books",
    "Toys & Games",
    "Automotive"
  ];


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

 
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    const validImages = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setSubmitStatus({
          success: false,
          message: "Please upload only image files"
        });
        return false;
      }
      return true;
    });
    
    setImages([...images, ...validImages]);
  };

 
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

 
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title) newErrors.title = "Product title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.actualPrice || formData.actualPrice <= 0) newErrors.actualPrice = "Valid price is required";
    if (formData.discount < 0) newErrors.discount = "Discount cannot be negative";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.stock || formData.stock < 0) newErrors.stock = "Valid stock quantity is required";
    if (images.length === 0) newErrors.images = "At least one image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "67763c15-c1b0-49bd-83ff-ce0d717e8c80"); 
    data.append("cloud_name", "Sellbi"); 

    const res=await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
      method: "POST",
      body: data,
    })
       const result = await res.json();
  return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({
        success: false,
        message: "Please fix the errors in the form"
      });
      return;
    }
    
    try {
    
      const uploadedUrls = await Promise.all(images.map((img) => uploadImage(img)));
      
      
      
         const submitData = {
      ...formData,
      images: uploadedUrls, 
    };
   
        
    
      console.log("Submitting product data:", submitData);
          await fetch("http://localhost:5000/api/market/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData),
    });
 
      setFormData({
        title: "",
        description: "",
        actualPrice: "",
        discount: "",
        category: "",
        stock: "",
        images:""
      });
      setImages([]);
      setErrors({});
      
      setSubmitStatus({
        success: true,
        message: "Product added successfully! Redirecting..."
      });
      
      setTimeout(() => {
        navigate("/products");
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting product:", error);
      setSubmitStatus({
        success: false,
        message: "Error adding product. Please try again."
      });
    }
  };



  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      <Box sx={{ mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Add New Product
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in the details below to add a new product to your marketplace
        </Typography>
      </Box>

     
      {submitStatus.message && (
        <Alert 
          severity={submitStatus.success ? "success" : "error"} 
          sx={{ mb: 3 }}
          onClose={() => setSubmitStatus({ success: null, message: "" })}
        >
          {submitStatus.message}
        </Alert>
      )}

      <Grid container spacing={4}>
 
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    error={!!errors.title}
                    helperText={errors.title}
                    placeholder="Enter a clear and descriptive product title"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    error={!!errors.description}
                    helperText={errors.description || "Describe your product in detail"}
                    placeholder="Include key features, specifications, and benefits"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Price (₹)"
                    name="actualPrice"
                    value={formData.actualPrice}
                    onChange={handleInputChange}
                    error={!!errors.actualPrice}
                    helperText={errors.actualPrice}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Discount (₹)"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    error={!!errors.discount}
                    helperText={errors.discount || "Optional"}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      input={<OutlinedInput label="Category" />}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Stock Quantity"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    error={!!errors.stock}
                    helperText={errors.stock}
                  />
                </Grid>
                
                
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      Product Images
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Upload at least one image of your product
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 1, mb: 2 }}
                    >
                      Upload Images
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                    
                    {errors.images && (
                      <FormHelperText error sx={{ mb: 2 }}>
                        {errors.images}
                      </FormHelperText>
                    )}
                    
                    <Grid container spacing={1}>
                      {images.map((image, index) => (
                        <Grid item xs={4} key={index}>
                          <Box sx={{ position: 'relative' }}>
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: '100%',
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: 8
                              }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                backgroundColor: 'rgba(255,255,255,0.8)'
                              }}
                              onClick={() => handleRemoveImage(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      backgroundColor: '#FF6B6B',
                      '&:hover': {
                        backgroundColor: '#FF5252',
                      }
                    }}
                  >
                    Add Product
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        
      
      </Grid>
    </Container>
  );
};

export default AddProduct;