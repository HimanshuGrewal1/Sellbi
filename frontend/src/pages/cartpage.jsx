import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Divider,
  TextField,
  Paper,
  alpha,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingBag as ShoppingBagIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [cartId,SetCartId]=useState();

  useEffect(() => {
    const fetchCartItems = async () => {  
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', 
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        
        const data = await response.json();
        setCartItems(data.items || []);
        SetCartId(data._id)
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCartItems();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    try {
      setUpdating(true);
      const response = await fetch('http://localhost:5000/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ itemId, quantity: quantity })
      });
      
      if (response.ok) {
        setCartItems(cartItems.map(item => 
          item.product._id === itemId ? { ...item, quantity: quantity } : item
        ));
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(true);
      const response = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId })
      });
      
      if (response.ok) {
        setCartItems(cartItems.filter(item => item.product._id !== productId));
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdating(false);
    }
  };

    const handlecheckOut = async () => {
    try {
        setUpdating(true);
        const response = await fetch('http://localhost:5000/api/order/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                items: cartItems,
                price: cartItems.reduce((sum, item) => sum + ((item.product.actualPrice-item.product.discount) * item.quantity), 0),
                CartId: cartId
            })
        })
        if(response.ok){
            setCartItems([]);
            navigate('/orders');
        }

    } catch(err){
        console.error('Checkout failed:', err);

    }
}

 
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + ((item.product.actualPrice-item.product.discount) * item.quantity);
  }, 0);
  const SEED=230
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * (SEED%10);
  const total = subtotal + shipping + tax;

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

  return (
    <div className="pt-20">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Shopping Cart
          </Typography>
          <Chip 
            label={`${cartItems.length} items`} 
            color="primary" 
            variant="outlined" 
            sx={{ ml: 2 }}
          />
        </Box>

        <Grid container spacing={4}>
          
          <Grid item xs={12} md={8}>
            {cartItems.length === 0 ? (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: alpha('#f5f5f5', 0.5),
                  borderRadius: 2
                }}
              >
                <ShoppingBagIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Your cart is empty
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start shopping to add items to your cart
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/products')}
                  sx={{ borderRadius: 2 }}
                >
                  Continue Shopping
                </Button>
              </Paper>
            ) : (
              <>
                {cartItems.map((item) => (
                  <Card 
                    key={item._id} 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      opacity: updating ? 0.7 : 1
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Grid container alignItems="center">
                        <Grid item xs={3} sm={2}>
                          <CardMedia
                            component="img"
                            image={item.product.images && item.product.images[0] 
                              ? item.product.images[0] 
                              : 'https://via.placeholder.com/80'}
                            alt={item.product.title}
                            sx={{ 
                              borderRadius: 1,
                              height: 80,
                              width: 80,
                              objectFit: 'cover'
                            }}
                          />
                        </Grid>
                        <Grid item xs={9} sm={5} sx={{ pl: 2 }}>
                          <Typography variant="h6" fontWeight="bold" noWrap>
                            {item.product.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.product.category}
                          </Typography>
                          <Typography variant="body1" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                            ${item.product.actualPrice-item.product.discount}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              disabled={updating}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <TextField
                              value={item.quantity}
                              size="small"
                              sx={{ 
                                width: 60, 
                                mx: 1,
                                '& .MuiOutlinedInput-input': { 
                                  textAlign: 'center',
                                  py: 0.5
                                }
                              }}
                              inputProps={{ 
                                min: 1,
                                style: { textAlign: 'center' }
                              }}
                              onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value) || 1)}
                              disabled={updating}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              disabled={updating}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Grid>
                        <Grid item xs={4} sm={2} sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" fontWeight="bold">
                            ${((item.product.actualPrice-item.product.discount) * item.quantity).toFixed(2)}
                          </Typography>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => removeItem(item.product._id)}
                            sx={{ mt: 1 }}
                            disabled={updating}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </Grid>

         
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: 100
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Order Summary
              </Typography>
              
              <Box display="flex" justifyContent="space-between" sx={{ my: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2">
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" sx={{ my: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Shipping
                </Typography>
                <Typography variant="body2">
                  ${shipping.toFixed(2)}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" sx={{ my: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Tax
                </Typography>
                <Typography variant="body2">
                  ${tax.toFixed(2)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box display="flex" justifyContent="space-between" sx={{ my: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={cartItems.length === 0 || updating}
                onClick={() => handlecheckOut()}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  mt: 2,
                  background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #388e3c 0%, #1b5e20 100%)",
                  },
                }}
              >
                {updating ? <CircularProgress size={24} /> : 'Proceed to Checkout'}
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  mt: 1.5
                }}
                onClick={() => navigate('/products')}
                disabled={updating}
              >
                Continue Shopping
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default CartPage;