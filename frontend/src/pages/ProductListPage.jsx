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
  Card,
  CardContent,
  CardMedia,
  alpha
} from "@mui/material";
import {
  Search as SearchIcon,
  Image as ImageIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/market/products?search=${search}&category=${category}&page=${page}&limit=8`
      );
      const data = await res.json();
      setProducts(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
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
      <Container maxWidth="xl" sx={{ py: 4, minHeight: "60vh" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center" sx={{ mb: 4 }}>
          Product Catalog
        </Typography>

        <Box display="flex" gap={2} mb={4} flexDirection={{ xs: "column", sm: "row" }}>
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
                borderRadius: 1,
              }
            }}
          />
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 200 } }}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="fashion">Fashion</MenuItem>
            <MenuItem value="books">Books</MenuItem>
          </TextField>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={6} minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {products.length === 0 ? (
              <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="300px"
                flexDirection="column"
                textAlign="center"
              >
                <ImageIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={3} justifyContent="center">
                  {products.map((product) => (
                    <Grid 
                      key={product._id} 
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 3
                      }}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <Card 
                        sx={{ 
                          width: '100%',
                          maxWidth: 345,
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
                        onClick={() => handleProductClick(product._id)}
                      >
                        <Box sx={{ 
                          height: 200, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: alpha('#f5f5f5', 0.5),
                        }}>
                          {product.image ? (
                            <CardMedia
                              component="img"
                              height="200"
                              image={product.image}
                              alt={product.title}
                              sx={{ 
                                objectFit: 'cover',
                                width: '100%'
                              }}
                            />
                          ) : (
                            <Box textAlign="center" color="grey.500">
                              <ImageIcon sx={{ fontSize: 48 }} />
                              <Typography variant="body2">No image available</Typography>
                            </Box>
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
                              fontSize: '1rem',
                              minHeight: '2.8rem'
                            }}
                          >
                            {product.title}
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mb: 1,
                              fontSize: '0.8rem'
                            }}
                          >
                            {product.category || "General"}
                          </Typography>

                          <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                            <Typography variant="h6" color="primary.main" fontWeight="bold">
                              ${product.actualPrice - (product.discount || 0)}
                            </Typography>
                            {product.discount > 0 && (
                              <Typography
                                variant="body2"
                                sx={{ textDecoration: 'line-through' }}
                                color="text.secondary"
                              >
                                ${product.actualPrice}
                              </Typography>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {!loading && totalPages > 1 && (
                  <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(e, value) => setPage(value)}
                      color="primary"
                      size="medium"
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default ProductList;