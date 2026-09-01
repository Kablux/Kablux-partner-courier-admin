import { MdAirlineSeatReclineNormal, MdDashboard } from "react-icons/md";
import { BiTrip } from "react-icons/bi";
import { FaCarOn } from "react-icons/fa6";
import { MdOutlineSettings } from "react-icons/md";
import { IoAnalyticsSharp } from "react-icons/io5";
import { IoMdPricetags } from "react-icons/io";
import { GrUserWorker } from "react-icons/gr";
import { GiWallet } from "react-icons/gi";
import type {
  NavSection,
} from "../types/common.types.js";

export const navSections: NavSection[] = [
  {
    title: null,
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: MdDashboard,
        path: "/",
      },
    ],
  },
  {
    title: null,
    items: [
      {
        id: "staff",
        label: "staff",
        icon: GrUserWorker,
        path: "/staff",
      },
      {
        id: "ride",
        label: "ride",
        icon: FaCarOn,
        path: "/ride",
      },
      {
        id: "Wallet",
        label: "Wallet",
        icon: GiWallet,
        path: "/wallet",
      },
      {
        id: "Analytics",
        label: "Analytics",
        icon: IoAnalyticsSharp,
        path: "/analytics",
      },
      {
        id: "Specials",
        label: "Specials",
        icon: IoMdPricetags,
        path: "/specials",
      },

      {
        id: "setting",
        label: "Setting",
        icon: MdOutlineSettings,
        path: "/settings",
      },
    ],
  },
];

export const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/staff": "Staff",
  "/ride": "Ride",
  "/wallet": "Wallet",
  "/analytics": "Analytics",
  "/specials": "Specials",
  "/settings": "Settings",
};

export const quickActions = [
  {
    label: "Credit/debit a premium rider's wallet",
    icon: "AccountBalanceWallet",
    path: "/transactions",
  },
  {
    label: "Suspend/activate a driver",
    icon: "PersonOff",
    path: "/drivers",
  },
  {
    label: "Create promo code",
    icon: "LocalOffer",
    path: "/corporate",
  },
  {
    label: "Send broadcast message",
    icon: "Campaign",
    path: "/notifications",
  },
  {
    label: "Assign driver to fleet owner",
    icon: "AssignmentInd",
    path: "/fleet",
  },
];
