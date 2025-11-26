import { joiResolver } from "@hookform/resolvers/joi";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../store";
import { registerUser } from "../../store/userSlice";
import { enqueueSnackbar } from "notistack";
import type { RegisterPayload } from "../../services/authService";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  email: string;
  password: string;
  confirmPassword: string;
  country?: string;
  city?: string;
  street?: string;
  houseNumber?: number | null;
}

const registerSchema = Joi.object<RegisterFormValues>({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  phone: Joi.string().required(),
  birthDate: Joi.date().iso().required(),
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be at least 7 characters, include English letters and at least one digit",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  country: Joi.string().allow(""),
  city: Joi.string().allow(""),
  street: Joi.string().allow(""),
  houseNumber: Joi.number().integer().min(1).allow(null),
});

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: joiResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      let avatarPayload: RegisterPayload["avatar"] | undefined;
      if (avatarFile) {
        const toBase64 = (file: File) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          });
        const base64 = await toBase64(avatarFile);
        avatarPayload = { url: base64, alt: avatarFile.name };
      }
      const payload: RegisterPayload = {
        name: { first: data.firstName, last: data.lastName },
        phone: data.phone,
        birthDate: data.birthDate,
        email: data.email,
        password: data.password,
        avatar: avatarPayload,
        address: {
          country: data.country,
          city: data.city,
          street: data.street,
          houseNumber: data.houseNumber ?? undefined,
        },
      };

      await dispatch(registerUser(payload)).unwrap();
      navigate("/feed");
      enqueueSnackbar("Registration successful", {
        variant: "success",
      });
    } catch (err) {
      console.error("Registration failed:", err);
      enqueueSnackbar("Registration failed. Please try again.", {
        variant: "error",
      });
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
        marginTop: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={5}
          sx={{
            p: 4,
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
            REGISTER
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{ position: "relative", width: 120, height: 120, mb: 5 }}
              >
                <Avatar
                  src={avatarPreview ?? undefined}
                  alt="avatar preview"
                  sx={{ width: 140, height: 140, bgcolor: "grey" }}
                />
                <IconButton
                  onClick={() => inputRef.current?.click()}
                  sx={{
                    position: "absolute",
                    right: -15,
                    bottom: -15,
                    bgcolor: "rgb(187, 180, 180)",
                    color: "#000",
                    "&:hover": { bgcolor: "rgb(180, 172, 172)" },
                    boxShadow: 1,
                  }}
                  size="small"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      setAvatarFile(file);
                      const url = URL.createObjectURL(file);
                      setAvatarPreview(url);
                    } else {
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }
                  }}
                  style={{ display: "none" }}
                />
              </Box>
            </Grid>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="First Name *"
                  fullWidth
                  margin="normal"
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Last Name *"
                  fullWidth
                  margin="normal"
                  {...register("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />{" "}
              </Grid>{" "}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Phone *"
                  fullWidth
                  margin="normal"
                  {...register("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>{" "}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Birth Date *"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  {...register("birthDate")}
                  error={!!errors.birthDate}
                  helperText={errors.birthDate?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Country"
                  fullWidth
                  margin="normal"
                  {...register("country")}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="City"
                  fullWidth
                  margin="normal"
                  {...register("city")}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Street"
                  fullWidth
                  margin="normal"
                  {...register("street")}
                  error={!!errors.street}
                  helperText={errors.street?.message}
                />
              </Grid>{" "}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="House Number"
                  type="number"
                  fullWidth
                  margin="normal"
                  {...register("houseNumber", { valueAsNumber: true })}
                  error={!!errors.houseNumber}
                  helperText={errors.houseNumber?.message}
                />{" "}
              </Grid>
              <TextField
                label="Email *"
                fullWidth
                margin="normal"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />{" "}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Password *"
                  type="password"
                  fullWidth
                  margin="normal"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>{" "}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Confirm Password *"
                  type="password"
                  fullWidth
                  margin="normal"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, bgcolor: "#1bbe3a" }}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{ color: "#1bbe3a", textDecoration: "none" }}
              >
                login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
export default RegisterPage;
