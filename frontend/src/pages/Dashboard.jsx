import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCompany } from "../api/companyApi";
import { setCompany } from "../store/companySlice";

const STAT_CARDS = [
  { key: "profileCompletion", label: "Profile Completion" },
  { key: "verificationStatus", label: "Verification Status" },
  { key: "openPositions", label: "Open Job Posts" },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      if (company) return;
      setLoading(true);
      try {
        const response = await getCompany();
        const companyData = response.data?.company ?? response.data;
        if (companyData) {
          dispatch(setCompany(companyData));
        }
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Unable to load company profile";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [company, dispatch]);

  const statValues = useMemo(() => {
    const completion = Math.min(
      100,
      company?.profileCompletion ?? (company ? 70 : 10)
    );
    const status = company?.isVerified ? "Verified" : "Pending Verification";
    const openings = company?.openPositions ?? 0;

    return {
      profileCompletion: `${completion}%`,
      verificationStatus: status,
      openPositions: openings,
    };
  }, [company]);

  return (
    <Box bgcolor="#F5F6FA" minHeight="100vh" py={6} px={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Welcome back{user?.fullname ? `, ${user.fullname}` : ""} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Here&apos;s a quick summary of your company performance.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => navigate("/profile")}
            sx={{ borderRadius: 8 }}
          >
            View Profile
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/settings/company")}
            sx={{ borderRadius: 8 }}
          >
            Update Settings
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3} mt={4}>
        {STAT_CARDS.map((card) => (
          <Grid item xs={12} md={4} key={card.key}>
            <Card sx={{ p: 3, borderRadius: 4, height: "100%" }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                {card.label}
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {statValues[card.key]}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 4, p: 3, borderRadius: 4 }}>
        <Typography variant="h6" mb={2}>
          Company Snapshot
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
          </Box>
        ) : company ? (
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {company.name ?? "Company name not set"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              {company.about ?? "Add a short description so candidates know you."}
            </Typography>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Industry
                </Typography>
                <Typography>
                  {company.industry ?? "Update your industry from settings."}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Team Size
                </Typography>
                <Typography>{company.teamSize ?? "Unknown"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography>{company.location ?? "Not provided"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Website
                </Typography>
                <Typography color="primary">
                  {company.website ?? "Add your website"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box py={6} textAlign="center">
            <Typography variant="body1" color="text.secondary" mb={2}>
              Let&apos;s complete your company profile to get better visibility.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/profile")}
              sx={{ borderRadius: 8 }}
            >
              Complete Profile
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
}
