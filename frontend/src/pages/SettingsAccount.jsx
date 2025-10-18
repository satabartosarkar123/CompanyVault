import React, { useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import {
  updateCompanyContact,
  updateCompanySecurity,
  deleteCompanyAccount,
} from "../api/companyApi";
import { setCompany, clearCompany } from "../store/companySlice";
import { logout } from "../store/authSlice";

const contactDefaults = {
  mapLocation: "",
  phone: "",
  email: "",
};

const passwordDefaults = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function SettingsAccount() {
  const dispatch = useDispatch();
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: contactDefaults,
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: {
      errors: passwordErrors,
      isSubmitting: passwordIsSubmitting,
    },
  } = useForm({
    defaultValues: passwordDefaults,
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    reset({
      mapLocation: company?.mapLocation ?? "",
      phone: company?.phone ?? "",
      email: company?.email ?? user?.email ?? "",
    });
  }, [company, user, reset]);

  const onSaveContact = async (values) => {
    try {
      const response = await updateCompanyContact(values);
      const updatedCompany = response.data?.company ?? response.data;
      if (updatedCompany) {
        dispatch(setCompany(updatedCompany));
      }
      toast.success("Contact information updated.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to update contact information.";
      toast.error(message);
    }
  };

  const onChangePassword = async (values) => {
    try {
      await updateCompanySecurity(values);
      toast.success("Password updated successfully.");
      resetPassword(passwordDefaults);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to change password.";
      toast.error(message);
    }
  };

  const onDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your company account? This action cannot be undone."
    );
    if (!confirmation) return;

    try {
      await deleteCompanyAccount();
      dispatch(clearCompany());
      dispatch(logout());
      toast.success("Company account deleted.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to delete company account.";
      toast.error(message);
    }
  };

  return (
    <Box display="flex" py={4} px={2} bgcolor="#F5F6FA" minHeight="100vh">
      <Box minWidth="220px" pr={3}>
        {/* Sidebar navigation */}
      </Box>
      <Box flex={1}>
        <Typography variant="h6" mb={3}>
          Settings
        </Typography>
        <Card sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="subtitle1" mb={2}>
            Contact Information
          </Typography>
          <form onSubmit={handleSubmit(onSaveContact)} noValidate>
            <Controller
              name="mapLocation"
              control={control}
              rules={{ required: "Map location is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Map Location"
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.mapLocation)}
                  helperText={errors.mapLocation?.message}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Enter a valid phone number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone"
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
                />
              )}
            />
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
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Stack direction="row" spacing={2} mt={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                disabled={isSubmitting}
                onClick={() =>
                  reset({
                    mapLocation: company?.mapLocation ?? "",
                    phone: company?.phone ?? "",
                    email: company?.email ?? user?.email ?? "",
                  })
                }
              >
                Reset
              </Button>
            </Stack>
          </form>

          <Typography variant="subtitle1" mt={5} mb={2}>
            Change Password
          </Typography>
          <form onSubmit={handlePasswordSubmit(onChangePassword)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="currentPassword"
                  control={passwordControl}
                  rules={{ required: "Current password is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Current Password"
                      type="password"
                      fullWidth
                      error={Boolean(passwordErrors.currentPassword)}
                      helperText={passwordErrors.currentPassword?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="newPassword"
                  control={passwordControl}
                  rules={{
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="New Password"
                      type="password"
                      fullWidth
                      error={Boolean(passwordErrors.newPassword)}
                      helperText={passwordErrors.newPassword?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="confirmPassword"
                  control={passwordControl}
                  rules={{
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Confirm Password"
                      type="password"
                      fullWidth
                      error={Boolean(passwordErrors.confirmPassword)}
                      helperText={passwordErrors.confirmPassword?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
              disabled={passwordIsSubmitting}
            >
              {passwordIsSubmitting ? "Updating..." : "Change Password"}
            </Button>
          </form>

          <Box mt={6} borderTop="1px solid #ECEFF5" pt={4}>
            <Typography color="error" fontWeight={600} mb={1}>
              Delete Your Company
            </Typography>
            <Typography color="text.secondary" mb={1}>
              Deleting your account will remove all company data. This action is
              irreversible.
            </Typography>
            <Button variant="outlined" color="error" onClick={onDeleteAccount}>
              Close Account
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
