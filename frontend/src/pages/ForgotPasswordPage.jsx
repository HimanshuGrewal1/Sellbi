import { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CssBaseline,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Link as MuiLink,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "info.main", width: 56, height: 56 }}>
              <MailOutlineIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight="bold">
              Forgot Password
            </Typography>

            {!isSubmitted ? (
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 3, width: "100%" }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 3 }}
                >
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </Typography>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

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
                    background:
                      "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #388e3c 0%, #1b5e20 100%)",
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={26} color="inherit" />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: "#43a047",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto",
                  }}
                >
                  <MailOutlineIcon sx={{ color: "white", fontSize: 32 }} />
                </motion.div>
                <Typography variant="body2" color="text.secondary">
                  If an account exists for <b>{email}</b>, you will receive a
                  password reset link shortly.
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3, width: "100%" }} />

            <MuiLink
              component={Link}
              to="/login"
              underline="hover"
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.9rem",
                color: "primary.main",
                fontWeight: 500,
              }}
            >
              <ArrowBackIcon sx={{ fontSize: "1rem", mr: 1 }} />
              Back to Login
            </MuiLink>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
