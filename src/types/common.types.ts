import type { IconType } from "react-icons";
import * as Icons from "@mui/icons-material";

export interface NavItem {
  id: string;
  label: string;
  icon: IconType;
  path: string;
}

export interface NavSection {
  title: string | null;
  items: NavItem[];
}

export interface FinanceBar {
  time: string;
  value: number;
  delta: number; // % change vs previous slot (for the tooltip)
}

export interface DeliveryStat {
  label: string;
  value: number;
  color: string;
}

export interface Ride {
  id: string;
  staff: string;
  avatar?: string;
  date: string;
  code: string;
  pickup: string;
  dropoff: string;
  status: "Successful" | "Cancelled" | "Pending";
}

export type FinancePeriod = "day" | "week" | "month";

export type UserStatus = "Approved" | "Canceled" | "Pending";

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  contact: string;
  code: string;
  date: string;
  status: UserStatus;
  role: string;
  gender: "Male" | "Female";
  address: string;
}