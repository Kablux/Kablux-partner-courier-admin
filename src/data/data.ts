import { 
  LayoutGrid, 
  ClipboardList, 
  MapPin,
  Users, 
  Motorbike, 
  Wallet, 
  ChartNoAxesCombined, 
  Store, 
  Handshake, 
  UserCog, 
  Bell, 
  Settings, 
  LogOut 
} from "lucide-react";
import type { DeliveryStat, FinanceBar, FinancePeriod, NavSection, Ride } from "../types/common.types";

export const navSections: NavSection[] = [
  {
    title: null,
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutGrid,
        path: "/",
      },
      {
        id: "order",
        label: "Orders",
        icon: ClipboardList,
        path: "/orders",
      },
      {
        id: "map",
        label: "Map",
        icon: MapPin,
        path: "/map",
      },
      {
        id: "user",
        label: "Users",
        icon: Users,
        path: "/users",
      },
      {
        id: "rider",
        label: "Riders",
        icon: Motorbike,
        path: "/riders",
      },
    ],
  },
  {
    title: null,
    items: [],
  },
  {
    title: "Payment",
    items: [
      {
        id: "wallet",
        label: "Wallet",
        icon: Wallet,
        path: "/wallet",
      },
      {
        id: "Analytics",
        label: "Analytics",
        icon: ChartNoAxesCombined,
        path: "/analytics",
      },
    ],
  },
  {
    title: "Partners",
    items: [
      {
        id: "vendor",
        label: "Vendor",
        icon: Store,
        path: "/vendor",
      },
      {
        id: "partners",
        label: "Partners",
        icon: Handshake,
        path: "/partners",
      },
      {
        id: "admin_role",
        label: "Admin Role",
        icon: UserCog,
        path: "/admin-role",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        id: "notification",
        label: "Notification",
        icon: Bell,
        path: "/notifications",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        path: "/settings",
      },
      {
        id: "logout",
        label: "Logout",
        icon: LogOut,
        path: "/logout",
      },
    ],
  },
];

export const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/riders": "Riders",
  "/riders/new": "Riders",
  "/drivers": "Drivers",
  "/trips": "Trips",
  "/corporate": "corporate",
  "/fleet": "Fleet",
  "/premium": "Premium",
  "/inspection": "Inspection",
  "/transactions": "Transactions",
  "/admin-role": "Admin Role",
  "/admin-role/create": "Create Admin Role",
  "/notifications": "Notifications",
  "/sos": "SOS",
  "/settings": "Settings",
  "/feedback": "Feedback",
  "/dispute": "Dispute",
  "/help": "Help",
};


export const PARTNER_STATS = {
  totalRiders: 0,
  todaysRevenue: 7000,
  activeRiders: 50,
  totalUsers: 100,
};

export const FINANCE_MILES = 258;

export const FINANCE_DATA: Record<FinancePeriod, FinanceBar[]> = {
  day: [
    { time: "1 PM", value: 180, delta: 15 },
    { time: "2 PM", value: 120, delta: -8 },
    { time: "3 PM", value: 150, delta: 6 },
    { time: "4 PM", value: 260, delta: 22 },
    { time: "5 PM", value: 175, delta: -5 },
    { time: "6 PM", value: 130, delta: -3 },
    { time: "7 PM", value: 195, delta: 11 },
  ],
  week: [
    { time: "Mon", value: 900, delta: 8 },
    { time: "Tue", value: 1200, delta: 14 },
    { time: "Wed", value: 780, delta: -6 },
    { time: "Thu", value: 1400, delta: 19 },
    { time: "Fri", value: 1050, delta: 4 },
    { time: "Sat", value: 1650, delta: 26 },
    { time: "Sun", value: 820, delta: -9 },
  ],
  month: [
    { time: "Wk 1", value: 5200, delta: 10 },
    { time: "Wk 2", value: 6100, delta: 17 },
    { time: "Wk 3", value: 4800, delta: -7 },
    { time: "Wk 4", value: 7300, delta: 21 },
  ],
};

export const DELIVERIES = {
  overall: 78,
  breakdown: [
    { label: "Ontime", value: 78, color: "#EF4444" },
    { label: "In Progress", value: 78, color: "#F5C518" },
    { label: "Delayed", value: 78, color: "#0A1F44" },
  ] as DeliveryStat[],
};

export const RIDES_HISTORY: Ride[] = [
  {
    id: "r1",
    staff: "David Demo",
    date: "06/04/2022",
    code: "VA-12345",
    pickup: "Ajah Shopping Mall",
    dropoff: "Ikoyi Complex",
    status: "Successful",
  },
  {
    id: "r2",
    staff: "David Demo",
    date: "06/04/2022",
    code: "VA-12345",
    pickup: "09123456987",
    dropoff: "Ikoyi Complex",
    status: "Cancelled",
  },
  {
    id: "r3",
    staff: "David Demo",
    date: "06/04/2022",
    code: "VA-12345",
    pickup: "09123456987",
    dropoff: "Ikoyi Complex",
    status: "Pending",
  },
  {
    id: "r4",
    staff: "David Demo",
    date: "06/04/2022",
    code: "VA-12345",
    pickup: "09123456987",
    dropoff: "Ikoyi Complex",
    status: "Cancelled",
  },
  {
    id: "r5",
    staff: "David Demo",
    date: "06/04/2022",
    code: "VA-12345",
    pickup: "09123456987",
    dropoff: "Ikoyi Complex",
    status: "Pending",
  },
];
