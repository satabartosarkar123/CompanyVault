import React, { useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { updateCompanySocials } from "../api/companyApi";
import { setCompany } from "../store/companySlice";

const socialPlatforms = [
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
];

const defaultValues = {
  socials: [{ platform: "", url: "" }],
};

export default function SettingsSocialLinks() {
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: "socials",
  });

  useEffect(() => {
    if (company?.socials?.length) {
      reset({
        socials: company.socials.map((social) => ({
          platform: social.platform ?? "",
          url: social.url ?? "",
        })),
      });
    }
  }, [company, reset]);

  const onSubmit = async (values) => {
    const filtered = values.socials.filter(
      (item) => item.platform && item.url
    );

    try {
      const response = await updateCompanySocials({ socials: filtered });
      const updatedCompany = response.data?.company ?? response.data;
      if (updatedCompany) {
        dispatch(setCompany(updatedCompany));
      }
      toast.success("Social links updated.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to update social links.";
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
            Social Media Profiles
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {fields.map((field, index) => (
              <Grid
                container
                spacing={2}
                alignItems="center"
                key={field.id}
                sx={{ mb: 1 }}
              >
                <Grid item xs={12} sm={4}>
                  <Controller
                    name={`socials.${index}.platform`}
                    control={control}
                    rules={{ required: "Select a platform" }}
                    render={({ field }) => (
                      <TextField
                        select
                        label="Platform"
                        fullWidth
                        {...field}
                        error={Boolean(
                          errors.socials?.[index]?.platform
                        )}
                        helperText={
                          errors.socials?.[index]?.platform?.message
                        }
                      >
                        <MenuItem value="">Select...</MenuItem>
                        {socialPlatforms.map((platform) => (
                          <MenuItem
                            key={platform.value}
                            value={platform.value}
                          >
                            {platform.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={11} sm={7}>
                  <Controller
                    name={`socials.${index}.url`}
                    control={control}
                    rules={{
                      required: "Profile URL is required",
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i,
                        message: "Enter a valid URL",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Profile link / URL"
                        fullWidth
                        error={Boolean(errors.socials?.[index]?.url)}
                        helperText={
                          errors.socials?.[index]?.url?.message
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={1} sm={1}>
                  <IconButton
                    onClick={() => remove(index)}
                    aria-label="Remove social link"
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              fullWidth
              sx={{ my: 2 }}
              type="button"
              onClick={() => append({ platform: "", url: "" })}
            >
              Add New Social Link
            </Button>
            <Button
              variant="contained"
              size="large"
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
