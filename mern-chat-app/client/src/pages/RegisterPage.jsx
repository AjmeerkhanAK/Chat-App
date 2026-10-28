
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { registerUser } from "../features/auth/authSlice";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError("");
    setSuccess("");

    if (form.name.trim().length < 2) {
      setValidationError("Name must contain at least 2 characters.");
      return;
    }

    if (form.password.length < 8) {
      setValidationError("Password must contain at least 8 characters.");
      return;
    }

    try {
      await dispatch(registerUser(form)).unwrap();
      setSuccess("Registration successful. Please log in.");
      setTimeout(() => navigate("/login", { replace: true }), 1000);
    } catch {
      // The Redux slice stores the API error.
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#F5F6FA",
        p: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: "1px solid #E8E8EF",
        }}
      >
        <Typography variant="h4" fontWeight={800} color="#635BFF">
          NIBZchat
        </Typography>
        <Typography sx={{ mt: 1, mb: 3 }} color="text.secondary">
          Create your account
        </Typography>

        {(error || validationError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError || error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <TextField
          label="Full name"
          fullWidth
          required
          margin="normal"
          autoComplete="name"
          value={form.name}
          onChange={(event) =>
            setForm({ ...form, name: event.target.value })
          }
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          margin="normal"
          autoComplete="email"
          value={form.email}
          onChange={(event) =>
            setForm({ ...form, email: event.target.value })
          }
        />

        <TextField
          label="Password (minimum 8 characters)"
          type="password"
          fullWidth
          required
          margin="normal"
          autoComplete="new-password"
          inputProps={{ minLength: 8 }}
          value={form.password}
          onChange={(event) =>
            setForm({ ...form, password: event.target.value })
          }
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 3, py: 1.3, bgcolor: "#635BFF" }}
        >
          {loading ? "Creating account..." : "Register"}
        </Button>

        <Typography textAlign="center" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <RouterLink to="/login">Login</RouterLink>
        </Typography>
      </Paper>
    </Box>
  );
}
