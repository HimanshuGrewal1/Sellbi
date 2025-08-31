import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Rating,
  Chip,
  Divider,
  Paper,
  Tabs,
  Tab,
  Button,
  alpha,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  LocationOn,
  Store,
  CalendarToday,
  Star,
  Inventory,
  Comment,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const SellerProfile = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [listings, setListings] = useState([]);
    const { user, logout } = useAuthStore();

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      try {
     
    
        setSeller(user);

        
        const productsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/market/seller/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setListings(productsData);
             setReviews(productsData.map(product => product.Review).flat());
        }
       
        
      } catch (error) {
        console.error('Failed to fetch seller data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, []);

  console.log('Seller Data:', seller);
  console.log('Listings:', listings);
    console.log('Reviews:', reviews);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  const handleDelete = async (productId) => {
    // if (!window.confirm('Are you sure you want to delete this product?')) return;
    console.log('Deleting product with ID:', productId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/market/delete/${productId}`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        setListings((prev) => prev.filter((product) => product._id !== productId));
        navigate('/seller');
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return (
      <div className="pt-20">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        </Container>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="pt-20">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <Typography variant="h6">Failed to load seller profile</Typography>
          </Box>
        </Container>
      </div>
    );
  }

  const averageRating= reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
  return (
    <div className="pt-20">
      <Container maxWidth="lg" sx={{ py: 4 }}>
       
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            mb: 4,
            position: 'relative'
          }}
        >
          <Box 
            sx={{ 
              height: 200,
              background: seller.coverImage 
                ? `url(${seller.coverImage})`
                : `linear-gradient(to right, ${alpha('#1976d2', 0.7)}, ${alpha('#42a5f5', 0.7)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <Box sx={{ p: 3, pt: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-end' }, mt: -8 }}>
              <Avatar
                src={seller.avatar}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: '4px solid white',
                  mr: 3,
                  mb: { xs: 2, md: 0 }
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center">
                  <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mr: 2 }}>
                    {seller.businessName || `${seller.name} `}
                  </Typography>
                  <IconButton color="primary" onClick={handleEditProfile} size="small">
                    <EditIcon />
                  </IconButton>
                </Box>
                
                <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
                  <Box display="flex" alignItems="center">
                    <Rating value={averageRating || 0} precision={0.1} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {averageRating?.toFixed(1) || '0'} ({seller.reviewCount || 0} reviews)
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center">
                    <Inventory sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {listings.length} listings
                    </Typography>
                  </Box>
                  
                  {seller.address && (
                    <Box display="flex" alignItems="center">
                      <LocationOn sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {seller.address}
                      </Typography>
                    </Box>
                  )}
                  
                  {seller.createdAt && (
                    <Box display="flex" alignItems="center">
                      <CalendarToday sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Member since {new Date(seller.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
                sx={{ borderRadius: 2 }}
              >
                Add Product
              </Button>
            </Box>
            
          </Box>
        </Paper>

      
        <Paper elevation={0} sx={{ borderRadius: 2, mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': { py: 2 }
            }}
          >
            <Tab icon={<Store />} iconPosition="start" label="My Listings" />
            <Tab icon={<Star />} iconPosition="start" label="Reviews" />
            <Tab icon={<Comment />} iconPosition="start" label="Profile" />
          </Tabs>
          
         
          <TabPanel value={tabValue} index={0}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
              >
                Add New Product
              </Button>
            </Box>
            
            {listings.length === 0 ? (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: alpha('#f5f5f5', 0.5),
                  borderRadius: 2
                }}
              >
                <Inventory sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  You haven't listed any products yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start by adding your first product to your catalog
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleAddProduct}
                  sx={{ borderRadius: 2 }}
                >
                  Add Your First Product
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {listings.map((listing) => (
                  <Grid key={listing._id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                      onClick={() => handleProductClick(listing._id)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={listing.images && listing.images[0] ? listing.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={listing.title}
                        sx={{ objectFit: 'cover' }}
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
                                                    onClick={() => handleDelete(listing._id)}
                                                  >
                                                    <DeleteIcon fontSize="small" />
                                                  </IconButton>

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" fontWeight="bold" noWrap>
                          {listing.title}
                        </Typography>
                        
                        <Chip 
                          label={listing.category || 'Uncategorized'} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mb: 2 }}
                        />
                        
                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            ${listing.actualPrice}
                          </Typography>
                          
                          {listing.rating > 0 && (
                            <Box display="flex" alignItems="center">
                              <Rating value={listing.rating} size="small" readOnly />
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                ({listing.reviewCount || 0})
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        
                        <Box mt={2}>
                          <Chip 
                            label={listing.isPublished ? 'Published' : 'Draft'} 
                            color={listing.isPublished ? 'success' : 'default'} 
                            size="small" 
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
          
         
          <TabPanel value={tabValue} index={1}>
            <Box>
              <Typography variant="h5" gutterBottom>
                Customer Reviews ({reviews.length})
              </Typography>
              
              {reviews.length === 0 ? (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    backgroundColor: alpha('#f5f5f5', 0.5),
                    borderRadius: 2
                  }}
                >
                  <Star sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No reviews yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your customers' reviews will appear here
                  </Typography>
                </Paper>
              ) : (
                reviews.map((review) => (
                  <Box key={review._id} sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="flex-start">
                      <Avatar src={review.user?.avatar} sx={{ mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
                          <Typography variant="h6">{review.user?.name || 'Anonymous'}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        
                        <Rating value={review.rating} size="small" readOnly sx={{ my: 1 }} />
                        
                        <Typography variant="body1">
                          {review.comment}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))
              )}
            </Box>
          </TabPanel>
          
       
          <TabPanel value={tabValue} index={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5">
                Profile Information
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
            </Box>
            
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: alpha('#f5f5f5', 0.5) }}>
                  <Typography variant="h6" gutterBottom>
                    Business Information
                  </Typography>
                  
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Business Name
                    </Typography>
                    <Typography variant="body1">
                      {seller.businessName || 'Not provided'}
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {seller.description || 'No description provided'}
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {seller.location || 'Not provided'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: alpha('#f5f5f5', 0.5) }}>
                  <Typography variant="h6" gutterBottom>
                    Seller Statistics
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          {listings.length}
                        </Typography>
                        <Typography variant="body2">Total Listings</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid size={{ xs: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          {reviews.length || 0}
                        </Typography>
                        <Typography variant="body2">Total Reviews</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid size={{ xs: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          {averageRating ? averageRating.toFixed(1) : '0.0'}
                        </Typography>
                        <Typography variant="body2">Average Rating</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid size={{ xs: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          {seller.createdAt ? new Date(seller.createdAt).getFullYear() : 'N/A'}
                        </Typography>
                        <Typography variant="body2">Member Since</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Container>
    </div>
  );
};

export default SellerProfile;