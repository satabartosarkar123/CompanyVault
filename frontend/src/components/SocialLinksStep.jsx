import React from "react";
import { Box, Button, Grid, TextField, Typography, IconButton } from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import CloseIcon from '@mui/icons-material/Close';

const socialOptions = [
  { label: "Facebook", icon: "🌐" },
  { label: "Twitter", icon: "🐦" },
  { label: "Instagram", icon: "📸" },
  { label: "Youtube", icon: "▶️" }
];

export default function SocialLinksStep({ onNext, onBack }) {
  const { control, handleSubmit } = useForm({
    defaultValues: { socials: [{ type: "", url: "" }] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "socials" });

  // eslint-disable-next-line no-unused-vars
  const onSubmit = (data) => {
    if (onNext) onNext();
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <form style={{ width: "60%" }} onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, idx) => (
          <Grid container spacing={2} alignItems="center" key={field.id}>
            <Grid item xs={3}>
              <Controller
                name={`socials[${idx}].type`}
                control={control}
                defaultValue={field.type}
                render={({ field }) => (
                  <TextField select label="Social"
                    fullWidth
                    {...field}
                  >
                    {socialOptions.map(opt => (
                      <option key={opt.label} value={opt.label}>{opt.label}</option>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={8}>
              <Controller
                name={`socials[${idx}].url`}
                control={control}
                defaultValue={field.url}
                render={({ field }) => (
                  <TextField label="Profile link/url" fullWidth {...field} />
                )}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => remove(idx)}><CloseIcon /></IconButton>
            </Grid>
          </Grid>
        ))}
        <Button onClick={() => append({ type: "", url: "" })} type="button" fullWidth sx={{ my: 2 }}>
          + Add New Social Link
        </Button>
        <Box my={3} display="flex" justifyContent="space-between">
          <Button onClick={onBack} variant="outlined">Previous</Button>
          <Button type="submit" variant="contained">Save & Next</Button>
        </Box>
      </form>
    </Box>
  );
}
