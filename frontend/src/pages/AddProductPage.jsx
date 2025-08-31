import React, { useState, useEffect } from "react";
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
  FormHelperText,
  LinearProgress
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    title: "",
    Description: "",
    actualPrice: "",
    discount: "0",
    category: "",
    stock: "",
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: "" });
  const [uploading, setUploading] = useState(false);

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

 
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

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
      
      if (file.size > 5 * 1024 * 1024) { 
        setSubmitStatus({
          success: false,
          message: "Image size should be less than 5MB"
        });
        return false;
      }
      
      return true;
    });
    
   
    const newPreviews = validImages.map(file => URL.createObjectURL(file));
    
    setImages([...images, ...validImages]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
    
 
    if (errors.images) {
      setErrors({
        ...errors,
        images: ""
      });
    }
  };

  const handleRemoveImage = (index) => {
   
    URL.revokeObjectURL(imagePreviews[index]);
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.Description.trim()) newErrors.Description = "Description is required";
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
    data.append("upload_preset", "Sellbi"); 
    data.append("cloud_name", "dm2j3voev"); 

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dm2j3voev/image/upload", {
        method: "POST",
        body: data,
      });
      
      if (!res.ok) {
        throw new Error("Image upload failed");
      }
      
      const result = await res.json();
      console.log(result);
      return result.secure_url;
      
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
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
      setUploading(true);
      
   
      const uploadedUrls = await Promise.all(
        images.map((img) => uploadImage(img))
      );
      
      
      const submitData = {
        ...formData,
        actualPrice: parseFloat(formData.actualPrice),
        discount: parseFloat(formData.discount || 0),
        stock: parseInt(formData.stock),
        images: uploadedUrls,
      };
      
     
      const response = await fetch(`https://sellbi.onrender.com/api/market/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
         credentials: "include" 
      });
      
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
      
  
      setFormData({
        title: "",
        Description: "",
        actualPrice: "",
        discount: "0",
        category: "",
        stock: "",
      });
      setImages([]);
      setImagePreviews([]);
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
    } finally {
      setUploading(false);
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
                    name="Description"
                    value={formData.Description}
                    onChange={handleInputChange}
                    error={!!errors.Description}
                    helperText={errors.Description || "Describe your product in detail"}
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
                    helperText={errors.discount || "Optional - enter 0 for no discount"}
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
                      Upload at least one image of your product (Max 5MB each)
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 1, mb: 2 }}
                      disabled={images.length >= 5}
                    >
                      Upload Images ({images.length}/5)
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
                      {imagePreviews.map((preview, index) => (
                        <Grid item xs={4} sm={3} key={index}>
                          <Box sx={{ position: 'relative' }}>
                            <img
                              src={preview}
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
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255,255,255,1)',
                                }
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
                  {uploading && (
                    <Box sx={{ width: '100%', mb: 2 }}>
                      <LinearProgress />
                      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                        Uploading images and creating product...
                      </Typography>
                    </Box>
                  )}
                  
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={uploading}
                    sx={{
                      py: 1.5,
                      backgroundColor: '#FF6B6B',
                      '&:hover': {
                        backgroundColor: '#FF5252',
                      }
                    }}
                  >
                    {uploading ? 'Processing...' : 'Add Product'}
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