import { Box, Button, Typography } from "@mui/material";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

export default function TeamMembersHeader() {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 700,
          color: "var(--text-primary)",
        }}
      >
        Team Members
      </Typography>

      <Typography
        sx={{
          color: "var(--text-muted)",
          mt: 0.5,
        }}
      >
        Manage organization members, roles, and access credentials.
      </Typography>
    </Box>
  );
}
