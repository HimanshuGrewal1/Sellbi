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
  IconButton,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@mui/material";
import {
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  AssignmentReturn as ReturnIcon,
  SupportAgent as SupportIcon,
  Comment as CommentIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Image as ImageIcon
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/Cart";
import { addToWishlist, removeFromWishlist } from "../store/Wishlist";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//  const wishlistItems = useSelector(state => state.wishlist);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [tabValue, setTabValue] = useState(0);

//  const isWishlisted = wishlistItems.some(item => item._id === product?._id);

  const handleAddToCart = (product) => {
    dispatch(addToCart({...product, quantity}));
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleReviewSubmit = () => {
    alert(`Thanks for your review! Rating: ${reviewRating}, Comment: ${reviewComment}`);
    setReviewDialogOpen(false);
    setReviewRating(0);
    setReviewComment("");
  };

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


  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
  
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
          Home
        </Link>
        <Link color="inherit" href="/products" onClick={(e) => { e.preventDefault(); navigate("/products"); }}>
          Products
        </Link>
        <Link color="inherit" href={`/products?category=${product.category}`} onClick={(e) => { e.preventDefault(); navigate(`/products?category=${product.category}`); }}>
          {product.category}
        </Link>
        <Typography color="text.primary">{product.title}</Typography>
      </Breadcrumbs>

      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Grid container spacing={4}>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row' }, alignItems: 'center' }}>
     
            {productImages.length > 1 && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'row', md: 'column' }, 
                mr: { md: 2 }, 
                mb: { xs: 2, md: 0 },
                overflowX: 'auto',
                maxWidth: { xs: '100%', md: '100px' }
              }}>
                {productImages.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 60,
                      height: 60,
                      border: selectedImage === index ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      m: 0.5,
                      flexShrink: 0
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </Box>
                ))}
              </Box>
            )}
            
  
            <Box sx={{ 
              width: '100%', 
              height: { xs: 300, md: 400 }, 
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              {productImages.length > 0 ? (
                <>
                  <Badge 
                    badgeContent={`-${discountPercentage}%`} 
                    color="error" 
                    sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
                    invisible={discountPercentage === 0}
                  >
                    <img 
                      src={productImages[selectedImage]} 
                      alt={product.title} 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain' 
                      }} 
                    />
                  </Badge>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="body2">No image available</Typography>
                </Box>
              )}
              
              <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column' }}>
                <IconButton 
                  onClick={handleWishlistToggle} 
                  // color={isWishlisted ? "error" : "default"}
                  sx={{ backgroundColor: 'white', boxShadow: 1, '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  {/* {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />} */}
                </IconButton>
                <IconButton 
                  onClick={handleShare}
                  sx={{ mt: 1, backgroundColor: 'white', boxShadow: 1, '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Grid>

  
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {product.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.averageRating || 4.5} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.Review?.length || 0} reviews)
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              SKU: {product.sku}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                ₹{discountPrice.toLocaleString()}
              </Typography>
              {product.discount > 0 && (
                <>
                  <Typography
                    variant="h6"
                    sx={{ textDecoration: "line-through", ml: 2 }}
                    color="text.secondary"
                  >
                    ₹{product.actualPrice.toLocaleString()}
                  </Typography>
                  <Chip 
                    label={`${discountPercentage}% OFF`} 
                    color="error" 
                    size="small" 
                    sx={{ ml: 2 }} 
                  />
                </>
              )}
            </Box>

            <Typography variant="body1" paragraph sx={{ color: 'text.primary', lineHeight: 1.6 }}>
              {product.description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Chip 
                label={product.stock > 0 ? "In Stock" : "Out of Stock"} 
                color={product.stock > 0 ? "success" : "error"} 
                variant="outlined" 
              />
              <Typography variant="body2" sx={{ ml: 2 }}>
                {product.stock} units available
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="body1" sx={{ mr: 2, fontWeight: 'medium' }}>Quantity:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 2 }}>{quantity}</Typography>
                <IconButton 
                  size="small" 
                  onClick={() => setQuantity(prev => prev + 1)}
                  disabled={quantity >= product.stock}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                sx={{ 
                  py: 1.5, 
                  borderRadius: 2, 
                  minWidth: 140,
                  backgroundColor: '#FF6B6B',
                  '&:hover': {
                    backgroundColor: '#FF5252',
                  }
                }}
                startIcon={<ShoppingCartCheckoutIcon />}
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ py: 1.5, borderRadius: 2, minWidth: 140 }}
                onClick={() => {
                  handleAddToCart(product);
                  navigate('/cart');
                }}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

          
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <ShippingIcon sx={{ fontSize: 30, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2">Free Shipping</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <ReturnIcon sx={{ fontSize: 30, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2">30-Day Returns</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 30, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2">2-Year Warranty</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <SupportIcon sx={{ fontSize: 30, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2">24/7 Support</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', mt: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label={`Reviews (${product.Review?.length || 0})`} />
          </Tabs>
        </Box>
        
        <Box sx={{ py: 3 }}>
          {tabValue === 0 && (
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {product.fullDescription || product.description || "No description available."}
            </Typography>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Product Specifications</Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Category" secondary={product.category} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="SKU" secondary={product.sku} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Weight" secondary="1.5 kg" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Dimensions" secondary="20 × 30 × 40 cm" />
                </ListItem>
              </List>
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Customer Reviews ({product.Review?.length || 0})
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<CommentIcon />}
                  onClick={() => setReviewDialogOpen(true)}
                >
                  Write a Review
                </Button>
              </Box>
              
              {product.Review && product.Review.length > 0 ? (
                product.Review.map((review, index) => (
                  <Box key={index} sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#fafafa' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ mr: 2, backgroundColor: 'primary.main' }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">{review.userName || "Anonymous"}</Typography>
                        <Rating value={review.rating} size="small" readOnly />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {new Date(review.date || Date.now()).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1">{review.comment}</Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#fafafa', borderRadius: 2 }}>
                  <CommentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No reviews yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Be the first to review this product
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => setReviewDialogOpen(true)}
                    sx={{ backgroundColor: '#FF6B6B', '&:hover': { backgroundColor: '#FF5252' } }}
                  >
                    Write a Review
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

   
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#f5f5f5' }}>Write a Review</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1">How would you rate this product?</Typography>
            <Rating
              value={reviewRating}
              onChange={(e, newValue) => setReviewRating(newValue)}
              size="large"
            />
            <TextField
              label="Your Review"
              multiline
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleReviewSubmit} 
            variant="contained" 
            disabled={reviewRating === 0 || reviewComment.trim() === ""}
            sx={{ backgroundColor: '#FF6B6B', '&:hover': { backgroundColor: '#FF5252' } }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetails;