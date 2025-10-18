import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

export default function ContactInfoStep({ onNext, onBack }) {
  const { control, handleSubmit } = useForm();

  // eslint-disable-next-line no-unused-vars
  const onSubmit = (data) => {
    if (onNext) onNext();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <form style={{ width: "60%" }} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="mapLocation"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField label="Map Location" fullWidth {...field} margin="normal" />
          )}
        />
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField label="Phone" fullWidth {...field} margin="normal" />
          )}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField label="Email" fullWidth {...field} margin="normal" />
          )}
        />
        <Box my={3} display="flex" justifyContent="space-between">
          <Button onClick={onBack} variant="outlined">Previous</Button>
          <Button type="submit" variant="contained">Finish Editing</Button>
        </Box>
      </form>
    </Box>
  );
}
