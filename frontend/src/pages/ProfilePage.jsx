import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuthStore } from "../store/authStore";

export default function ProfilePage() {
  const { user, updateProfile, logout, isLoading } = useAuthStore();

  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.address || "");
  const [role, setRole] = useState(user?.Role || "buyer");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAddress(user.address);
      setRole(user.Role);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setError("");
      setSuccess("");
      await updateProfile({ name, address, Role: role });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Update failed");
    }
  };

  if (!user) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="pt-20">
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Paper
          elevation={4}
          sx={{ mt: 6, p: 4, borderRadius: 3, textAlign: "center" }}
        >
          <Avatar
            sx={{
              m: "auto",
              bgcolor: "secondary.main",
              width: 80,
              height: 80,
            }}
          >
            <AccountCircleIcon fontSize="large" />
          </Avatar>

          <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 3 }}>
            My Profile
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" value={user.email} disabled />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>

            {/* Role Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="buyer">Buyer</MenuItem>
                  <MenuItem value="seller">Seller</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Chip
                label={user.isVerified ? "Verified" : "Not Verified"}
                color={user.isVerified ? "success" : "warning"}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Last Login: {new Date(user.lastLogin).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>

          {/* Update button */}
          <Button
            variant="contained"
            fullWidth
            disabled={isLoading}
            onClick={handleUpdate}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 3,
              fontWeight: "bold",
              background:
                "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Update Profile"}
          </Button>

          {/* Logout button */}
          <Button
            variant="outlined"
            fullWidth
            onClick={logout}
            sx={{ mt: 2, borderRadius: 3 }}
          >
            Logout
          </Button>
        </Paper>
      </Container>
    </div>
  );
}
