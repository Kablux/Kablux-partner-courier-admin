import React from "react";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import WebhookRoundedIcon from "@mui/icons-material/WebhookRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { ActivityLogEntry } from "../../types/index.types";
import { EMPTY_VALUE } from "../../utils/format";

/** Words that should stay upper-case when a code is turned into text. */
const ACRONYMS: Record<string, string> = { api: "API", url: "URL", id: "ID", ip: "IP" };

/** API_KEY_CREATED / api_key -> "API key created" / "API key" */
export const humanize = (value?: string | null): string => {
  if (!value) return EMPTY_VALUE;
  const words = value.replace(/[_.-]+/g, " ").trim().toLowerCase().split(/\s+/);
  const text = words.map((w) => ACRONYMS[w] ?? w).join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const ACTION_LABELS: Record<string, string> = {
  MEMBER_LOGGED_IN: "Signed in",
  MEMBER_LOGGED_OUT: "Signed out",
  API_KEY_CREATED: "API key created",
  API_KEY_REVOKED: "API key revoked",
  MEMBER_ADDED: "Member added",
  MEMBER_REMOVED: "Member removed",
  WEBHOOK_ENDPOINT_UPDATED: "Webhook updated",
  WEBHOOK_ENDPOINT_CREATED: "Webhook created",
};

/** Action codes the panel knows a label for; offered as suggestions in the filters. */
export const KNOWN_ACTIONS = Object.keys(ACTION_LABELS);

export const actionLabel = (action: string) =>
  ACTION_LABELS[action?.toUpperCase()] ?? humanize(action);

export type ActionTone = "success" | "danger" | "warning" | "info" | "neutral";

export const actionTone = (action: string): ActionTone => {
  const a = (action || "").toUpperCase();
  if (/(DELETED|REMOVED|REVOKED|FAILED|DISABLED|CANCELLED)/.test(a)) return "danger";
  if (/(CREATED|ADDED|ENABLED|INVITED)/.test(a)) return "success";
  if (/(UPDATED|CHANGED|EDITED|RESET)/.test(a)) return "warning";
  if (/(LOGGED_IN|LOGGED_OUT|LOGIN|LOGOUT)/.test(a)) return "info";
  return "neutral";
};

export const TONE_COLORS: Record<ActionTone, string> = {
  success: "#16A34A",
  danger: "#DC2626",
  warning: "#D97706",
  info: "#2563EB",
  neutral: "#64748B",
};

/** Icon by what the action is about. */
export const actionIcon = (entry: ActivityLogEntry): React.ElementType => {
  const a = `${entry.action} ${entry.object_type}`.toUpperCase();
  if (a.includes("LOGGED_OUT") || a.includes("LOGOUT")) return LogoutRoundedIcon;
  if (a.includes("LOGGED_IN") || a.includes("LOGIN")) return LoginRoundedIcon;
  if (a.includes("API_KEY")) return VpnKeyOutlinedIcon;
  if (a.includes("WEBHOOK")) return WebhookRoundedIcon;
  if (a.includes("ORDER") || a.includes("RIDE") || a.includes("DELIVERY")) return TwoWheelerRoundedIcon;
  if (a.includes("MEMBER") || a.includes("USER")) return PersonOutlineRoundedIcon;
  if (a.includes("SETTING")) return SettingsOutlinedIcon;
  return HistoryRoundedIcon;
};

/** A short line under the action, e.g. `API key · "production"`. */
export const actionSubject = (entry: ActivityLogEntry): string => {
  const name = entry.metadata?.name;
  const target = humanize(entry.object_type);
  return typeof name === "string" && name ? `${target} · "${name}"` : target;
};

export const displayName = (label?: string | null) =>
  (label || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const initials = (label?: string | null) =>
  displayName(label)
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("") || "?";

export const metadataEntries = (metadata: ActivityLogEntry["metadata"]) =>
  Object.entries(metadata ?? {}).map(([key, value]) => ({
    key: humanize(key),
    value: typeof value === "object" ? JSON.stringify(value) : String(value),
  }));

/** "9 Nov 2026" */
export const formatDay = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? EMPTY_VALUE
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export const formatTime = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};
