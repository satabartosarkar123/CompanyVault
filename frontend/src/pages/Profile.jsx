import React, { useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createCompany,
  updateCompanyProfile,
} from "../api/companyApi";
import { setCompany } from "../store/companySlice";

const defaultValues = {
  name: "",
  tagline: "",
  about: "",
  location: "",
  website: "",
  logoUrl: "",
  bannerUrl: "",
};

export default function Profile() {
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
        tagline: company.tagline ?? "",
        about: company.about ?? "",
        location: company.location ?? "",
        website: company.website ?? "",
        logoUrl: company.logoUrl ?? "",
        bannerUrl: company.bannerUrl ?? "",
      });
    }
  }, [company, reset]);

  const onSubmit = async (values) => {
    try {
      const requester = company?.id ? updateCompanyProfile : createCompany;
      const response = await requester(values);
      const savedCompany = response.data?.company ?? response.data;
      if (savedCompany) {
        dispatch(setCompany(savedCompany));
      }
      toast.success(
        company?.id
          ? "Company profile updated successfully."
          : "Company profile created successfully."
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to save company profile.";
      toast.error(message);
    }
  };

  return (
    <Box bgcolor="#F5F6FA" minHeight="100vh" py={6} px={4}>
      <Card sx={{ maxWidth: 960, mx: "auto", p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Company Profile
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Keep your company details up to date so candidates know who you are.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Company name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Name"
                    fullWidth
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="tagline"
                control={control}
                rules={{
                  maxLength: {
                    value: 120,
                    message: "Tagline should be under 120 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tagline"
                    fullWidth
                    error={Boolean(errors.tagline)}
                    helperText={errors.tagline?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="about"
                control={control}
                rules={{
                  required: "Tell us a bit about your company",
                  minLength: {
                    value: 20,
                    message: "Description should be at least 20 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="About"
                    fullWidth
                    multiline
                    rows={4}
                    error={Boolean(errors.about)}
                    helperText={errors.about?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="location"
                control={control}
                rules={{ required: "Location is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Location"
                    fullWidth
                    error={Boolean(errors.location)}
                    helperText={errors.location?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="website"
                control={control}
                rules={{
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i,
                    message: "Enter a valid website URL",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Website"
                    fullWidth
                    error={Boolean(errors.website)}
                    helperText={errors.website?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="logoUrl"
                control={control}
                rules={{
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i,
                    message: "Enter a valid logo URL",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Logo URL"
                    fullWidth
                    error={Boolean(errors.logoUrl)}
                    helperText={errors.logoUrl?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="bannerUrl"
                control={control}
                rules={{
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i,
                    message: "Enter a valid banner URL",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Banner URL"
                    fullWidth
                    error={Boolean(errors.bannerUrl)}
                    helperText={errors.bannerUrl?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} mt={4}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ borderRadius: 8 }}
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
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
                        tagline: company.tagline ?? "",
                        about: company.about ?? "",
                        location: company.location ?? "",
                        website: company.website ?? "",
                        logoUrl: company.logoUrl ?? "",
                        bannerUrl: company.bannerUrl ?? "",
                      }
                    : defaultValues
                )
              }
              sx={{ borderRadius: 8 }}
            >
              Reset
            </Button>
          </Stack>
        </form>
      </Card>
    </Box>
  );
}
