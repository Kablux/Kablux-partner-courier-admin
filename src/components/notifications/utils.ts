import React from "react";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { NotificationReadFilter } from "../../types/index.types";

export const GOLD = "#F5C518";

export const FILTERS: {
  key: NotificationReadFilter;
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
];

export const TYPE_ICONS: Record<string, React.ElementType> = {
  order: TwoWheelerRoundedIcon,
  ride: TwoWheelerRoundedIcon,
  delivery: LocalShippingRoundedIcon,
  payment: PaymentsRoundedIcon,
  wallet: PaymentsRoundedIcon,
  payout: PaymentsRoundedIcon,
  security: ShieldRoundedIcon,
  system: SettingsRoundedIcon,
  account: PersonRoundedIcon,
  user: PersonRoundedIcon,
  alert: WarningAmberRoundedIcon,
  warning: WarningAmberRoundedIcon,
};

export const PRIORITY_COLORS: Record<string, string> = {
  urgent: "#EF4444",
  critical: "#EF4444",
  high: "#F97316",
  medium: GOLD,
  normal: GOLD,
  low: "#64748B",
};

export function iconFor(type: string): React.ElementType {
  return TYPE_ICONS[type?.toLowerCase()] || NotificationsNoneRoundedIcon;
}

export function colorForPriority(priority: string): string {
  return PRIORITY_COLORS[priority?.toLowerCase()] || GOLD;
}

export function formatPriorityLabel(priority: string): string {
  if (!priority) return "";

  return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
}

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);

  if (isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 5) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

export function getExtraEntries(
  data?: Record<string, unknown> | null,
): [string, string | number][] {
  if (!data) return [];

  return Object.entries(data)
    .filter(
      ([, value]) => typeof value === "string" || typeof value === "number",
    )
    .slice(0, 3) as [string, string | number][];
}
