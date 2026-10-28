
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
import { loginUser } from "../features/auth/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError("");

    if (!form.email.trim() || !form.password) {
      setValidationError("Please enter your email and password.");
      return;
    }

    try {
      await dispatch(loginUser(form)).unwrap();
      navigate("/chat", { replace: true });
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
          NIBZchat App
        </Typography>
        <Typography sx={{ mt: 1, mb: 3 }} color="text.secondary">
          Sign in to your account
        </Typography>

        {(error || validationError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError || error}
          </Alert>
        )}

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
          label="Password"
          type="password"
          fullWidth
          required
          margin="normal"
          autoComplete="current-password"
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
          {loading ? "Signing in..." : "Login"}
        </Button>

        <Typography textAlign="center" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <RouterLink to="/register">Register</RouterLink>
        </Typography>
      </Paper>
    </Box>
  );
}
