import React from "react";
import { Box, Button, Typography } from "@mui/material";

export default function CompletionStep() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
      <Typography variant="h4" mb={2}>🎉 Congratulations, Your profile is 100% complete!</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Donec hendrerit, ante mattis pellentesque eleifend, tortor urna malesuada ante, eget aliquam nulla augue hendrerit ligula.
        Nunc mauris arcu, mattis sed sem vitae.
      </Typography>
      <Box>
        <Button sx={{ mx: 1 }} variant="outlined">View Dashboard</Button>
        <Button sx={{ mx: 1 }} variant="contained">View Profile</Button>
      </Box>
    </Box>
  );
}
