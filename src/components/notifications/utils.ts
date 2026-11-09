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

/** Finds the first known keyword inside a type such as "order_created". */
const matchType = <T,>(type: string, table: Record<string, T>): T | undefined => {
  const value = (type || "").toLowerCase();
  const key = Object.keys(table).find((k) => value.includes(k));
  return key ? table[key] : undefined;
};

export function iconFor(type: string): React.ElementType {
  return matchType(type, TYPE_ICONS) || NotificationsNoneRoundedIcon;
}

/** Solid badge colours per notification type. */
const TYPE_COLORS: Record<string, string> = {
  order: "#0891B2",
  ride: "#0891B2",
  delivery: "#0284C7",
  payment: "#16A34A",
  wallet: "#16A34A",
  payout: "#16A34A",
  security: "#DC2626",
  alert: "#EA580C",
  warning: "#EA580C",
  system: "#7C3AED",
  account: "#2563EB",
  user: "#2563EB",
};

/** Used for unknown types, picked by a stable hash so each type keeps its colour. */
const FALLBACK_COLORS = ["#16A34A", "#EA580C", "#7C3AED", "#0891B2", "#2563EB", "#DB2777"];

export function colorForType(type: string): string {
  const known = matchType(type, TYPE_COLORS);
  if (known) return known;
  const hash = [...(type || "")].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}

/** ORDER_UPDATE / order_update -> Order update */
export function formatTypeLabel(type: string): string {
  if (!type) return "Notification";
  const text = type.replace(/[_.-]+/g, " ").trim().toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** 24 Nov 2026 at 9:30 AM */
export function formatNotificationDate(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  const day = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${day} at ${time}`;
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
