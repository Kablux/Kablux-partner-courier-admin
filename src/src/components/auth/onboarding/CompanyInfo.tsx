import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  MenuItem,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { updateCompanyInfo, nextStep } from "../../../redux/slices/Onboarding";

export default function CompanyInfo() {
  const dispatch = useAppDispatch();

  const storedInfo = useAppSelector((state) => state.onboarding.companyInfo);

  const [formData, setFormData] = useState({
    companyName: storedInfo.companyName,
    registrationNumber: storedInfo.registrationNumber,
    companyEmail: storedInfo.companyEmail,
    staffCapacity: storedInfo.staffCapacity,
    phone: storedInfo.phone,
    region: storedInfo.region,
    isAuthorized: storedInfo.isAuthorized,
  });

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "isAuthorized" ? e.target.checked : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleNext = () => {
    // 1. Save data to Redux
    dispatch(updateCompanyInfo(formData));
    // 2. Advance to next step
    dispatch(nextStep());
  };

  return (
    <Box>
      <h1 className="montserrat text-3xl">Tell us about your company</h1>

      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 4 }}
        className="poppins"
      >
        <TextField
          label="Company Name"
          value={formData.companyName}
          onChange={handleChange("companyName")}
          fullWidth
          size="small"
        />
        <TextField
          label="Registration Number"
          value={formData.registrationNumber}
          onChange={handleChange("registrationNumber")}
          fullWidth
          size="small"
        />
        <TextField
          label="Company Email"
          type="email"
          value={formData.companyEmail}
          onChange={handleChange("companyEmail")}
          fullWidth
          size="small"
        />
        <TextField
          select
          label="Staff Capacity"
          value={formData.staffCapacity}
          onChange={handleChange("staffCapacity")}
          fullWidth
          size="small"
        >
          <MenuItem value="1-10">1 - 10</MenuItem>
          <MenuItem value="11-50">11 - 50</MenuItem>
          <MenuItem value="50+">50+</MenuItem>
        </TextField>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            required
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={handleChange("phone")}
            fullWidth
            size="small"
          />
          <TextField
            required
            label="Region"
            type="text"
            value={formData.region}
            onChange={handleChange("region")}
            fullWidth
            size="small"
          />
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isAuthorized}
              onChange={handleChange("isAuthorized")}
              sx={{
                color: "var(--accent-gold)",
                "&.Mui-checked": { color: "var(--accent-gold)" },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>
              I agree on behalf of my company, to the Kablux for business terms
              ans conditions, which govern our use of Kablux for business
              products, and to the Kablux Terms and Conditions
            </Typography>
          }
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleNext}
          disabled={
            !formData.isAuthorized ||
            !formData.companyName ||
            !formData.registrationNumber ||
            !formData.companyEmail ||
            !formData.staffCapacity ||
            !formData.phone ||
            !formData.region
          } 
          sx={{
            mt: 2,
            py: 1.2,
            backgroundColor: "var(--accent-gold)",
            color: "#000",
            fontWeight: 600,
            "&:hover": { backgroundColor: "var(--accent-gold-dim)" },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
