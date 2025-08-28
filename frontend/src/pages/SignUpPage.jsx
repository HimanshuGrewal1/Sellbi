import React, { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  CssBaseline,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    Role: "buyer",
  });
const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
			await signup(formData);
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
  };
console.log(formData);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "fadeIn 0.6s ease-in-out",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}>
            <PersonAddIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight="bold">
            Create Your Account
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 1, mb: 2 }}
          >
            Join us today and explore endless possibilities 🚀
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
            <Grid container spacing={2}>
            
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

            
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

            
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

           
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

            
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  name="role"
                  value={formData.Role}
                  onChange={handleChange}
                  variant="outlined"
                >
                  <MenuItem value="buyer">Buyer</MenuItem>
                  <MenuItem value="seller">Seller</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontSize: "1rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5b0fbd 0%, #1f65e6 100%)",
                },
              }}
            >
              {isLoading ? <CircularProgress size={26} color="inherit" /> : "Sign Up"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
