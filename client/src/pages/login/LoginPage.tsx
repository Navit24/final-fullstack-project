import type { LoginCredentials } from "../../services/authService";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { Link, useNavigate, useLocation } from "react-router-dom";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";

import { loginUser } from "../../store/userSlice";

import { enqueueSnackbar } from "notistack";

import { useState } from "react";

const loginSchema = Joi.object<LoginCredentials>({
  email: Joi.string().email({ tlds: false }).required().messages({
    "string.empty": "שדה אימייל חובה",
    "string.email": "אימייל לא תקין",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "שדה סיסמה חובה",
    "string.min": "סיסמה חייבת להכיל לפחות 6 תווים",
  }),
});

const LoginPage = () => {
  // hooks לניווט ו-Redux
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  // קבלת הנתיב המקורי שממנו הגיע המשתמש
  const from = location.state?.from?.pathname || "/feed";

  // state לניהול מצב טעינה
  const [isLoading, setIsLoading] = useState(false);

  // הגדרת הטופס עם ולידציה
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({ resolver: joiResolver(loginSchema) });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate(from, { replace: true });
      enqueueSnackbar("Login successful", {
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Login failed. Please check your credentials.";
      console.error("Login failed:", error);
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 1,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 3,
            }}
          >
            LOGIN
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="email"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="password"
              type="password"
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, bgcolor: "#1bbe3a" }}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{ color: "#1bbe3a", textDecoration: "none" }}
              >
                register
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
