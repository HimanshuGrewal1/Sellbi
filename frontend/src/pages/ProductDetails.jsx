
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Rating,
  Button,
  Paper,
  Grid,
  Container,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  IconButton
} from "@mui/material";
import {
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/market/product/${id}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Error fetching product details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading product details...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Product not found
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const discountPrice = product.actualPrice - (product.discount || 0);
  const discountPercentage = product.discount > 0 
    ? Math.round((product.discount / product.actualPrice) * 100) 
    : 0;

  return (
 <Paper sx={{ p: 4, borderRadius: 3, mt: 2 }}>
      <Typography variant="h4" fontWeight="bold">
        {product.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        SKU: {product.sku}
      </Typography>

      <Typography variant="h6" color="success.main">
        ₹{product.actualPrice - (product.discount || 0)}
      </Typography>
      {product.discount > 0 && (
        <Typography
          variant="body2"
          sx={{ textDecoration: "line-through" }}
          color="text.secondary"
        >
          ₹{product.actualPrice}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="body1">{product.Description}</Typography>

      <Box mt={2}>
        <Chip label={`Stock: ${product.stock}`} color="info" />
        <Chip
          label={product.category}
          color="primary"
          variant="outlined"
          sx={{ ml: 1 }}
        />
      </Box>

      {/* Reviews */}
      <Box mt={3}>
        <Typography variant="h6">Reviews</Typography>
        {product.Review?.length > 0 ? (
          product.Review.map((r, idx) => (
            <Box key={idx} mt={1}>
              <Rating value={r.rating} readOnly />
              <Typography variant="body2">{r.comment}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No reviews yet.
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3, py: 1.5, borderRadius: 3 }}
        startIcon={<ShoppingCartCheckoutIcon />}
      >
        Buy Now
      </Button>
    </Paper>
  );
};

export default ProductDetails;
