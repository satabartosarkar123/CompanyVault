import React, { useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { updateCompanyProfile } from "../api/companyApi";
import { setCompany } from "../store/companySlice";

const defaultValues = {
  organizationType: "",
  industry: "",
  teamSize: "",
  yearEstablished: "",
  companyWebsite: "",
  companyVision: "",
};

const organizationTypes = [
  "Private",
  "Public",
  "Non-profit",
  "Government",
  "Startup",
];

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
];

const teamSizes = ["1-10", "11-50", "51-200", "201-500", "500+"]; 

export default function SettingsProfileInfo() {
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
        organizationType: company.organizationType ?? "",
        industry: company.industry ?? "",
        teamSize: company.teamSize ?? "",
        yearEstablished: company.yearEstablished ?? "",
        companyWebsite: company.website ?? "",
        companyVision: company.vision ?? "",
      });
    }
  }, [company, reset]);

  const onSubmit = async (values) => {
    const payload = {
      organizationType: values.organizationType,
      industry: values.industry,
      teamSize: values.teamSize,
      yearEstablished: values.yearEstablished,
      website: values.companyWebsite,
      vision: values.companyVision,
    };

    try {
      const response = await updateCompanyProfile(payload);
      const updatedCompany = response.data?.company ?? response.data;
      if (updatedCompany) {
        dispatch(setCompany(updatedCompany));
      }
      toast.success("Company profile details updated.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update company details.";
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
            Founding Info
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="organizationType"
                  control={control}
                  rules={{ required: "Organization type is required" }}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Organization Type"
                      fullWidth
                      margin="normal"
                      {...field}
                      error={Boolean(errors.organizationType)}
                      helperText={errors.organizationType?.message}
                    >
                      <MenuItem value="">Select...</MenuItem>
                      {organizationTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="industry"
                  control={control}
                  rules={{ required: "Industry type is required" }}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Industry Types"
                      fullWidth
                      margin="normal"
                      {...field}
                      error={Boolean(errors.industry)}
                      helperText={errors.industry?.message}
                    >
                      <MenuItem value="">Select...</MenuItem>
                      {industries.map((industry) => (
                        <MenuItem key={industry} value={industry}>
                          {industry}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="teamSize"
                  control={control}
                  rules={{ required: "Team size is required" }}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Team Size"
                      fullWidth
                      margin="normal"
                      {...field}
                      error={Boolean(errors.teamSize)}
                      helperText={errors.teamSize?.message}
                    >
                      <MenuItem value="">Select...</MenuItem>
                      {teamSizes.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="yearEstablished"
                  control={control}
                  rules={{
                    required: "Year of establishment is required",
                    pattern: {
                      value: /^[0-9]{4}$/,
                      message: "Enter a valid year",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Year of Establishment"
                      fullWidth
                      margin="normal"
                      error={Boolean(errors.yearEstablished)}
                      helperText={errors.yearEstablished?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="companyWebsite"
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
                      label="Company Website"
                      fullWidth
                      margin="normal"
                      error={Boolean(errors.companyWebsite)}
                      helperText={errors.companyWebsite?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="companyVision"
                  control={control}
                  rules={{
                    minLength: {
                      value: 20,
                      message: "Vision should be at least 20 characters",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Company Vision"
                      fullWidth
                      multiline
                      rows={3}
                      margin="normal"
                      error={Boolean(errors.companyVision)}
                      helperText={errors.companyVision?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>
      </Box>
    </Box>
  );
}
