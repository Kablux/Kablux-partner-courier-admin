import { Box, Typography } from "@mui/material";
import ApiKeyCard from "../components/api-keys/ApiKeyCard";
import { API_KEYS, SECURITY_TIPS } from "../data/data";

export default function ApiKeysPage() {
  return (
    <Box
      className="fade-in"
      sx={{ p: 1, display: "flex", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: "100%",
        //   maxWidth: 1284,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {/* Header */}
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
            API Keys 
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: "var(--text-muted, var(--text-secondary))",
            }}
          >
            Manage API keys, webhooks, and access developer resources
          </Typography>
        </Box>

        {/* Key cards */}
        {API_KEYS.map((k) => (
          <ApiKeyCard key={k.id} apiKey={k} />
        ))}

        {/* Security best practices */}
        <Box
          sx={{
            borderRadius: "14px",
            p: 3,
            backgroundColor: "rgba(245,197,24,0.08)",
            border: "1px solid rgba(245,197,24,0.28)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Typography component="span" sx={{ fontSize: 16 }}>
              💡
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
              Security Best Practices
            </Typography>
          </Box>

          <Box component="ul" sx={{ m: 0, pl: 0, listStyle: "none" }}>
            {SECURITY_TIPS.map((tip) => (
              <Box
                key={tip}
                component="li"
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 0.75,
                  "&:last-of-type": { mb: 0 },
                }}
              >
                <Box
                  component="span"
                  sx={{ color: "#D9A400", lineHeight: 1.6, flexShrink: 0 }}
                >
                  •
                </Box>
                <Typography
                  sx={{ fontSize: 13, color: "#B4830B", lineHeight: 1.6 }}
                >
                  {tip}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
