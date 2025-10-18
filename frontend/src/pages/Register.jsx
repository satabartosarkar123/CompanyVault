import React from "react";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register as registerApi } from "../api/authApi";
import { setUser } from "../store/authSlice";
import { setCompany } from "../store/companySlice";

export default function Register() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullname: "",
      mobile: "",
      email: "",
      gender: "M",
      password: "",
      confirmPassword: "",
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (values) => {
    try {
      const payload = {
        fullname: values.fullname,
        mobileno: values.mobile,
        email: values.email,
        gender: values.gender,
        password: values.password,
        signuptype: "email",
      };

      const response = await registerApi(payload);
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

      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
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
      <Card
        sx={{
          borderRadius: 6,
          width: "70%",
          px: 6,
          py: 8,
          display: "flex",
          gap: 4,
          boxShadow: 3,
        }}
      >
        <Box
          flex={1}
          borderRadius={5}
          sx={{
            background:
              "linear-gradient(180deg, rgba(214,190,255,0.9) 0%, rgba(185,171,239,0.95) 100%)",
          }}
        />
        <Box flex={1.5}>
          <Typography variant="h5" mb={3}>
            Register as a Company
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="fullname"
              control={control}
              rules={{
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.fullname)}
                  helperText={errors.fullname?.message}
                />
              )}
            />

            <Controller
              name="mobile"
              control={control}
              rules={{
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Enter a valid phone number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mobile No"
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.mobile)}
                  helperText={errors.mobile?.message}
                  inputMode="tel"
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: "Organization email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Organization Email"
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  autoComplete="email"
                />
              )}
            />

            <Typography fontWeight={600} mt={2}>
              Gender
            </Typography>
            <Controller
              name="gender"
              control={control}
              rules={{ required: "Please select a gender" }}
              render={({ field }) => (
                <FormControl error={Boolean(errors.gender)}>
                  <RadioGroup row {...field}>
                    <FormControlLabel value="M" control={<Radio />} label="Male" />
                    <FormControlLabel value="F" control={<Radio />} label="Female" />
                  </RadioGroup>
                  {errors.gender && (
                    <FormHelperText>{errors.gender.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
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
                  autoComplete="new-password"
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword?.message}
                  autoComplete="new-password"
                />
              )}
            />

            <Box my={3}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ py: 1.2, fontSize: 18, borderRadius: 8 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Register"}
              </Button>
            </Box>
            <Box textAlign="center" mt={1.5}>
              Already have an account?
              <Button variant="text" onClick={() => navigate("/login")}>
                Login
              </Button>
            </Box>
          </form>
        </Box>
      </Card>
    </Box>
  );
}
