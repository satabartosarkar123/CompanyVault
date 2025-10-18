import React from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../api/authApi";
import { setUser } from "../store/authSlice";
import { setCompany } from "../store/companySlice";

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      const { user, token, company } = response.data ?? {};

      dispatch(
        setUser({
          user,
          token,
        })
      );

      if (company) {
        dispatch(setCompany(company));
      }

      toast.success("Logged in!");
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#F8F8FF"
    >
      <Card sx={{ borderRadius: 6, width: "50%", px: 6, py: 8, boxShadow: 3 }}>
        <Typography variant="h4" textAlign="center" mb={4}>
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Enter a valid email address",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                autoComplete="email"
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                autoComplete="current-password"
              />
            )}
          />

          <Box my={3}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ py: 1.5, fontSize: 18, borderRadius: 8 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </Button>
          </Box>
          <Box textAlign="center" mt={2}>
            Don&apos;t have an account?
            <Button variant="text" onClick={() => navigate("/register")}>
              Register
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
