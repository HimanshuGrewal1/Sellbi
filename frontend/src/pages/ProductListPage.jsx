import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  MenuItem,
  Container,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  CardMedia,
  alpha
} from "@mui/material";
import {
  Search as SearchIcon,
  Image as ImageIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalOffer as LocalOfferIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCard } from "../store/Cart";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
      const dispatch=useDispatch();
    const handleAddToCard=(product)=>{
      dispatch(addToCard(product))
  
    }

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/market/products?search=${search}&category=${category}&page=${page}&limit=8`
      );
      const data = await res.json();
      setProducts(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="pt-20">
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        Our Products
      </Typography>

      <Box display="flex" gap={2} mb={3} flexDirection={{ xs: "column", sm: "row" }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ width: { xs: '100%', sm: 200 } }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="electronics">Electronics</MenuItem>
          <MenuItem value="fashion">Fashion</MenuItem>
          <MenuItem value="books">Books</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    cursor: 'pointer'
                  }
                }}
                onClick={() => handleProductClick(product._id)}
              >
                <Box sx={{ 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: alpha('#f5f5f5', 0.5),
                  position: 'relative'
                }}>
                  {product.image ? (
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image}
                      alt={product.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box textAlign="center" color="grey.500">
                      <ImageIcon sx={{ fontSize: 48 }} />
                      <Typography variant="body2">No image</Typography>
                    </Box>
                  )}
                  
                  {product.discount > 0 && (
                    <Chip
                      label={`${Math.round((product.discount / product.actualPrice) * 100)}% OFF`}
                      color="error"
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        left: 12,
                        fontWeight: 'bold'
                      }}
                    />
                  )}
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
                    }}
                  >
                    {product.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2
                    }}
                  >
                    {product.Description}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={1}>
                    <Chip
                      icon={<LocalOfferIcon />}
                      label={product.category || "General"}
                      size="small"
                      variant="outlined"
                    />
                    {product.isFeatured && (
                      <Chip
                        label="Featured"
                        color="secondary"
                        size="small"
                      />
                    )}
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mt={2}>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                      ₹{product.actualPrice - (product.discount || 0)}
                    </Typography>
                    {product.discount > 0 && (
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: 'line-through' }}
                        color="text.secondary"
                      >
                        ₹{product.actualPrice}
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                  
                         onClick={() => handleAddToCard(product)}
                  
                    sx={{
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #388e3c 0%, #1b5e20 100%)",
                      },
                    }}
                 
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
    </div>
  );
};

export default ProductList;