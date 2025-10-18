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
import { updateCompanyProfile } from "../api/companyApi";
import { setCompany } from "../store/companySlice";

const defaultValues = {
  name: "",
  about: "",
  logoUrl: "",
  bannerUrl: "",
};

export default function SettingsCompanyInfo() {
  const dispatch = useDispatch();
  const { company } = useSelector((state) => state.company);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name ?? "",
        about: company.about ?? "",
        logoUrl: company.logoUrl ?? "",
        bannerUrl: company.bannerUrl ?? "",
      });
    }
  }, [company, reset]);

  const onSubmit = async (values) => {
    try {
      const response = await updateCompanyProfile(values);
      const updatedCompany = response.data?.company ?? response.data;
      if (updatedCompany) {
        dispatch(setCompany(updatedCompany));
      }
      toast.success("Company information updated.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update company information.";
      toast.error(message);
    }
  };

  return (
    <Box display="flex" py={4} px={2} bgcolor="#F5F6FA" minHeight="100vh">
      <Box minWidth="220px" pr={3}>
        {/* Sidebar navigation placeholder */}
      </Box>
      <Box flex={1}>
        <Typography variant="h6" mb={3}>
          Settings
        </Typography>
        <Card sx={{ p: 4, borderRadius: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="subtitle1" mb={2}>
              Logo &amp; Banner Image
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Box
                  sx={{
                    border: "2px dashed #C3C3C3",
                    borderRadius: 2,
                    height: 160,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#FAFAFF",
                    color: "text.secondary",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  {company?.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt="Company logo"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  ) : (
                    <Typography variant="body2">
                      Upload a logo (URL below)
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Box
                  sx={{
                    border: "2px dashed #C3C3C3",
                    borderRadius: 2,
                    height: 160,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#FAFAFF",
                    color: "text.secondary",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  {company?.bannerUrl ? (
                    <img
                      src={company.bannerUrl}
                      alt="Company banner"
                      style={{ width: "100%", maxHeight: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Typography variant="body2">
                      Upload a banner (URL below, recommended 1520x400)
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="logoUrl"
                  control={control}
                  rules={{
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i,
                      message: "Enter a valid URL",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Logo URL"
                      fullWidth
                      margin="normal"
                      error={Boolean(errors.logoUrl)}
                      helperText={errors.logoUrl?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="bannerUrl"
                  control={control}
                  rules={{
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i,
                      message: "Enter a valid URL",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Banner URL"
                      fullWidth
                      margin="normal"
                      error={Boolean(errors.bannerUrl)}
                      helperText={errors.bannerUrl?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Controller
              name="name"
              control={control}
              rules={{ required: "Company name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  label="Company name"
                  fullWidth
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="about"
              control={control}
              rules={{
                required: "Please provide a short description",
                minLength: {
                  value: 20,
                  message: "Tell us a bit more about the company (20+ chars)",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  label="About us"
                  fullWidth
                  multiline
                  rows={4}
                  error={Boolean(errors.about)}
                  helperText={errors.about?.message}
                />
              )}
            />

            <Stack direction="row" spacing={2} mt={3}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                disabled={isSubmitting}
                onClick={() =>
                  reset(
                    company
                      ? {
                          name: company.name ?? "",
                          about: company.about ?? "",
                          logoUrl: company.logoUrl ?? "",
                          bannerUrl: company.bannerUrl ?? "",
                        }
                      : defaultValues
                  )
                }
              >
                Reset
              </Button>
            </Stack>
          </form>
        </Card>
      </Box>
    </Box>
  );
}
