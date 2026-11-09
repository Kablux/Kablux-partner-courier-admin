import { Box, Tooltip, Typography } from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { NotificationItem } from "../../types/index.types";
import {
  colorForPriority,
  colorForType,
  formatNotificationDate,
  formatPriorityLabel,
  formatRelativeTime,
  formatTypeLabel,
  getExtraEntries,
  iconFor,
} from "./utils";

interface NotificationRowProps {
  item: NotificationItem;
}

export default function NotificationRow({ item }: NotificationRowProps) {
  const Icon = iconFor(item.notification_type);
  const badgeColor = colorForType(item.notification_type);
  const priorityColor = colorForPriority(item.priority);
  const details = getExtraEntries(item.data);
  const unread = !item.is_read;

  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 1.5, sm: 2.5 },
        px: { xs: 1, sm: 1.5 },
        py: 2.5,
        borderBottom: "1px solid var(--border)",
        "&:last-of-type": { borderBottom: 0 },
        transition: "background-color 0.15s ease",
        "&:hover": { backgroundColor: "rgba(120,130,150,0.04)" },
      }}
    >
      <Box sx={{ position: "relative", flexShrink: 0, mt: 0.25 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            backgroundColor: "rgba(120,130,150,0.14)",
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
        {unread && (
          <Box
            aria-label="Unread"
            sx={{
              position: "absolute",
              top: -3,
              right: -3,
              width: 9,
              height: 9,
              borderRadius: "50%",
              backgroundColor: "var(--accent-gold, #F5C518)",
              border: "2px solid var(--bg-card)",
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Box
            component="span"
            sx={{
              display: "inline-block",
              px: 0.75,
              py: 0.25,
              borderRadius: "3px",
              fontSize: 11,
              fontWeight: 600,
              lineHeight: 1.5,
              color: "#fff",
              backgroundColor: badgeColor,
            }}
          >
            {formatTypeLabel(item.notification_type)}
          </Box>

          <Tooltip title={formatRelativeTime(item.created_at)} placement="top">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                color: "var(--text-muted)",
                flexShrink: 0,
              }}
            >
              <AccessTimeRoundedIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: 12, whiteSpace: "nowrap" }}>
                {formatNotificationDate(item.created_at)}
              </Typography>
            </Box>
          </Tooltip>
        </Box>

        <Typography
          sx={{
            mt: 1,
            fontSize: 14,
            fontWeight: unread ? 700 : 600,
            color: "var(--text-primary)",
          }}
        >
          {item.title}
        </Typography>

        {item.body && (
          <Typography
            sx={{
              mt: 0.5,
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.body}
          </Typography>
        )}

        {(item.priority || details.length > 0) && (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              columnGap: 1.5,
              rowGap: 0.5,
            }}
          >
            {item.priority && (
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: priorityColor }}>
                {formatPriorityLabel(item.priority)}
              </Typography>
            )}
            {details.map(([key, value]) => (
              <Typography
                key={key}
                sx={{ fontSize: 12, color: "var(--text-muted)" }}
              >
                {formatTypeLabel(key)}: {String(value)}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
