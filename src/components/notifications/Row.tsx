import { Box, Typography } from "@mui/material";
import { NotificationItem } from "../../types/index.types";
import { colorForPriority, formatPriorityLabel, formatRelativeTime, getExtraEntries, iconFor } from "./utils";


interface NotificationRowProps {
  item: NotificationItem;
}

export default function NotificationRow({
  item,
}: NotificationRowProps) {
  const Icon = iconFor(item.notification_type);
  const tint = colorForPriority(item.priority);

  const extraEntries = getExtraEntries(item.data);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        borderRadius: 1,
        backgroundColor: item.is_read
          ? "transparent"
          : "rgba(245,197,24,0.06)",
        border: "1px solid var(--border-subtle)",
        transition: "background-color 0.15s ease",

        "&:hover": {
          backgroundColor: item.is_read
            ? "rgba(120,130,150,0.04)"
            : "rgba(245,197,24,0.1)",
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "12px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: tint,
          backgroundColor: `${tint}1F`,
        }}
      >
        <Icon sx={{ fontSize: 20 }} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Title + time */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {!item.is_read && (
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#F5C518",
                flexShrink: 0,
              }}
            />
          )}

          <Typography
            sx={{
              fontSize: 13.5,
              fontWeight: item.is_read ? 500 : 700,
              color: "var(--text-primary)",
              flex: 1,
              minWidth: 0,
            }}
          >
            {item.title}
          </Typography>

          <Typography
            sx={{
              fontSize: 11.5,
              color: "var(--text-muted)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {formatRelativeTime(item.created_at)}
          </Typography>
        </Box>

        {/* Body */}
        <Typography
          sx={{
            fontSize: 12.5,
            color: "var(--text-muted)",
            mt: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.body}
        </Typography>

        {/* Metadata */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1,
            flexWrap: "wrap",
          }}
        >
          {item.priority && (
            <Box
              sx={{
                fontSize: 10.5,
                fontWeight: 700,
                px: 1,
                py: 0.25,
                borderRadius: "6px",
                color: tint,
                backgroundColor: `${tint}1A`,
              }}
            >
              {formatPriorityLabel(item.priority)}
            </Box>
          )}

          {extraEntries.map(([key, value]) => (
            <Box
              key={key}
              sx={{
                fontSize: 10.5,
                px: 1,
                py: 0.25,
                borderRadius: "6px",
                color: "var(--text-muted)",
                backgroundColor: "rgba(120,130,150,0.1)",
              }}
            >
              {key.replace(/_/g, " ")}: {String(value)}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}