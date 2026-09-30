import React from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Button,
  Chip,
  alpha,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

interface TeamMembersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  totalMembers: number;
  onAddMember: () => void;
}

export default function TeamMembersToolbar({
  search,
  onSearchChange,
  totalMembers,
  onAddMember,
}: TeamMembersToolbarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", sm: "center" },
        gap: 2,
        mb: 3,
      }}
    >
      {/* Search & Counter Container */}
      <Paper
        elevation={0}
        sx={{
          p: 1.25,
          pl: 1.5,
          borderRadius: "14px",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.03)",
          flex: 1,
          maxWidth: { xs: "100%", sm: 600 },
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <TextField
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              height:42,
              borderRadius: "10px",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.common.white, 0.04)
                  : alpha(theme.palette.common.black, 0.02),
              transition: "all 0.2s ease-in-out",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "divider",
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent",
              },
              "&.Mui-focused": {
                boxShadow: "0 0 0 3px rgba(224, 179, 22, 0.18)",
                backgroundColor: "background.paper",
              },
            },
            "& .MuiInputBase-input": {
              fontSize: "0.875rem",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Member Counter Chip */}
        <Chip
          label={
            <Typography
              component="span"
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "text.secondary",
                whiteSpace: "nowrap",
              }}
            >
              Total:{" "}
              <Box
                component="span"
                sx={{ color: "text.primary", fontWeight: 700 }}
              >
                {totalMembers}
              </Box>{" "}
              {totalMembers === 1 ? "member" : "members"}
            </Typography>
          }
          size="medium"
          sx={{
            height: 36,
            px: 0.5,
            borderRadius: "8px",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? alpha(theme.palette.common.white, 0.05)
                : alpha(theme.palette.common.black, 0.03),
            border: "1px solid",
            borderColor: "divider",
            display: { xs: "none", sm: "inline-flex" },
          }}
        />
      </Paper>

      {/* Add Member Primary Button */}
      <Button
        variant="contained"
        startIcon={<PersonAddAlt1RoundedIcon fontSize="small" />}
        onClick={onAddMember}
        sx={{
          backgroundColor: "var(--accent-gold, #E5B800)",
          color: "#0D0D0D",
          fontWeight: 500,
          fontSize: "0.875rem",
          textTransform: "none",
          px: 3,
          py: 1.25,
          borderRadius: "10px",
          boxShadow: "0 4px 14px rgba(229, 184, 0, 0.3)",
          whiteSpace: "nowrap",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "#D4A700",
            boxShadow: "0 6px 18px rgba(229, 184, 0, 0.45)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        }}
      >
        Add Member
      </Button>
    </Box>
  );
}