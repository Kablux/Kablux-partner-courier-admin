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

export interface CompanyInfo {
  companyName: string;
  registrationNumber: string;
  companyEmail: string;
  staffCapacity: string;
  phone: string;
  region: string;
  isAuthorized: boolean;
}