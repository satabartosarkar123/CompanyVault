import React from "react";
import { Box, Button, Card, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

export default function FoundingInfoStep({ onNext, onBack }) {
  const { control, handleSubmit } = useForm();

  const onSubmit = () => {
    if (onNext) onNext();
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <form style={{ width: "60%" }} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Controller
              name="organizationType"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField select label="Organization Type" fullWidth {...field}>
                  <MenuItem value="">Select...</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                  <MenuItem value="Government">Government</MenuItem>
                  {/* Add more as needed */}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name="industryType"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField select label="Industry Types" fullWidth {...field}>
                  <MenuItem value="">Select...</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  {/* More types */}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name="teamSize"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField select label="Team Size" fullWidth {...field}>
                  <MenuItem value="">Select...</MenuItem>
                  <MenuItem value="1-10">1-10</MenuItem>
                  <MenuItem value="11-50">11-50</MenuItem>
                  {/* More */}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name="yearEstablished"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField label="Year of Establishment" fullWidth {...field} />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Controller
              name="companyWebsite"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField label="Company Website" fullWidth {...field} />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="companyVision"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Company Vision"
                  fullWidth
                  multiline
                  rows={3}
                  {...field}
                  placeholder="Tell us what Vision of your company..."
                />
              )}
            />
          </Grid>
        </Grid>
        <Box my={3} display="flex" justifyContent="space-between">
          <Button onClick={onBack} variant="outlined">Previous</Button>
          <Button type="submit" variant="contained">Save & Next</Button>
        </Box>
      </form>
    </Box>
  );
}
