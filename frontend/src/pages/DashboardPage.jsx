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
  Chip,
  Divider,
  Paper,
  Tabs,
  Tab,
  Button,
  alpha,
  CircularProgress,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Badge
} from '@mui/material';
import {
  ShoppingBag,
  Favorite,
  Person,
  CalendarToday,
  LocalShipping,
  CheckCircle,
  ArrowForward,
  RemoveShoppingCart,
  FavoriteBorder,
  Dashboard
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

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


const OrderStatusStepper = ({ status }) => {
  const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
  
  let activeStep = 0;
  switch(status) {
    case 'processing':
      activeStep = 1;
      break;
    case 'shipped':
      activeStep = 2;
      break;
    case 'delivered':
      activeStep = 3;
      break;
    default:
      activeStep = 0;
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const {user}=useAuthStore()

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
         const wishlistResponse = await fetch(`https://sellbi.onrender.com/api/auth/wishlist`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
 
         if (wishlistResponse.ok) {
          const wishlist = await wishlistResponse.json();
          console.log(wishlist)
          setWishlist(wishlist.wishlist || []);
        }

       
        const ordersResponse = await fetch(`https://sellbi.onrender.com/api/order`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData);
        }

       

   
    
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
 

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const removeFromWishlist = async (productId) => {
    
    try {
      const response = await fetch(`https://sellbi.onrender.com/api//auth/wishlist/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setWishlist(wishlist.filter(item => item.product._id !== productId));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (!user) {
    return (
      <div className="pt-20">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <Typography variant="h6">Failed to load user profile</Typography>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            mb: 4,
            background: `linear-gradient(to right, ${alpha('#1976d2', 0.1)}, ${alpha('#42a5f5', 0.1)})`,
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={user.avatar}
              sx={{ 
                width: 80, 
                height: 80, 
                mr: 3,
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {user.firstName} {user.lastName}
              </Typography>
              
              <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
                <Box display="flex" alignItems="center">
                  <ShoppingBag sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {orders.length} orders
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <Favorite sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {wishlist.length} wishlist items
                  </Typography>
                </Box>
                
                {user.joinDate && (
                  <Box display="flex" alignItems="center">
                    <CalendarToday sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Member since {formatDate(user.joinDate)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            
            <Button 
              variant="outlined" 
              startIcon={<Person />}
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </Button>
          </Box>
        </Paper>

        {/* Tabs */}
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
            <Tab icon={<ShoppingBag />} iconPosition="start" label="Orders" />
            <Tab icon={<Favorite />} iconPosition="start" label="Wishlist" />
          </Tabs>
          
          {/* Orders Tab */}
          <TabPanel value={tabValue} index={0}>
            {orders.length === 0 ? (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: alpha('#f5f5f5', 0.5),
                  borderRadius: 2
                }}
              >
                <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  You haven't placed any orders yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start shopping to see your order history here
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/products')}
                  sx={{ borderRadius: 2 }}
                >
                  Start Shopping
                </Button>
              </Paper>
            ) : (
              <Box>
                {orders.map((order) => (
                  <Card key={order._id} sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Placed on {formatDate(order.createdAt)}
                          </Typography>
                        </Box>
                        
                     
                      </Box>
                      
                      <OrderStatusStepper status={order.status} />
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Grid container spacing={2}>
                        {order.items.slice(0, 3).map((item) => (
                          <Grid key={item._id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box display="flex" alignItems="center">
                              <CardMedia
                                component="img"
                                image={item.product.images && item.product.images[0] 
                                  ? item.product.images[0] 
                                  : 'https://via.placeholder.com/80x80?text=No+Image'}
                                alt={item.product.title}
                                sx={{ width: 60, height: 60, borderRadius: 1, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: 150 }}>
                                  {item.product.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Qty: {item.quantity}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  ${item.product.actualPrice-item.product.discount} each
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                        
                        {order.items.length > 3 && (
                          <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" color="primary" textAlign="center" sx={{ mt: 1 }}>
                              +{order.items.length - 3} more items
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                      
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button 
                          variant="outlined" 
                          endIcon={<ArrowForward />}
                          onClick={() => navigate(`/order/${order._id}`)}
                        >
                          View Order Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </TabPanel>
          
          {/* Wishlist Tab */}
          <TabPanel value={tabValue} index={1}>
            {wishlist.length === 0 ? (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: alpha('#f5f5f5', 0.5),
                  borderRadius: 2
                }}
              >
                <FavoriteBorder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Your wishlist is empty
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Save items you love for easy access later
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/products')}
                  sx={{ borderRadius: 2 }}
                >
                  Browse Products
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {wishlist.map((item) => (
                  <Grid key={item._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={item.images && item.images[0] 
                            ? item.images[0] 
                            : 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={item.title}
                          sx={{ objectFit: 'cover' }}
                          onClick={() => handleProductClick(item._id)}
                        />
                        <IconButton 
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8,
                            backgroundColor: 'white',
                            '&:hover': { backgroundColor: 'white' }
                          }}
                          onClick={() => removeFromWishlist(item._id)}
                        >
                          <Favorite color="error" />
                        </IconButton>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography 
                          gutterBottom 
                          variant="h6" 
                          fontWeight="bold"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '2.8rem'
                          }}
                          onClick={() => handleProductClick(item._id)}
                        >
                          {item.title}
                        </Typography>
                        
                        <Chip 
                          label={item.category || 'Uncategorized'} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mb: 2 }}
                        />
                        
                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            ${item.actualPrice}
                          </Typography>
                          
                          {item.discount > 0 && (
                            <Typography
                              variant="body2"
                              sx={{ textDecoration: 'line-through' }}
                              color="text.secondary"
                            >
                              ${item.actualPrice + item.discount}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                      
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleProductClick(item._id)}
                          sx={{ borderRadius: 2 }}
                        >
                          View Product
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
        </Paper>
      </Container>
    </div>
  );
};

export default DashboardPage;