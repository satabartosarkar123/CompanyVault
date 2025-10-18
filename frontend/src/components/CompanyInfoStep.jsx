import { Box, Card, Typography, Grid, TextField, Button } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useForm, Controller } from "react-hook-form";

export default function CompanyInfoStep({ onNext }) {
  const { control, handleSubmit } = useForm();

  const onSubmit = () => {
    // TODO: save data logic, then...
    if (onNext) onNext();
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h6" mt={4} mb={2}>Logo & Banner Image</Typography>
      <form style={{ width: "60%" }} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 3, minHeight: "180px", border: "2px dashed #C3C3C3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <CloudUploadOutlinedIcon fontSize="large" />
              <Typography variant="body2" align="center">
                <strong>Browse photo</strong> or drop here<br />
                A photo larger than 400px works best. Max photo size 5MB.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Card sx={{ p: 3, minHeight: "180px", border: "2px dashed #C3C3C3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <CloudUploadOutlinedIcon fontSize="large" />
              <Typography variant="body2" align="center">
                <strong>Browse photo</strong> or drop here<br />
                Banner images optimal dimension 1520x400.<br />
                Supported format JPEG, PNG. Max photo size 5MB.
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Controller
            name="companyName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="Company name" fullWidth variant="outlined" margin="normal" />
            )}
          />
          <Controller
            name="aboutUs"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="About Us"
                fullWidth
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                placeholder="Write down about your company here. Let the candidate know who we are..."
              />
            )}
          />
        </Box>

        <Button type="submit" variant="contained" sx={{ mt: 3, px: 4 }}>
          Save & Next
        </Button>
      </form>
    </Box>
  );
}
