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
  LogOut,
} from "lucide-react";
import type {
  DeliveryStat,
  FinanceBar,
  FinancePeriod,
  NavSection,
  Ride,
  User,
} from "../types/common.types";

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
        id: "user",
        label: "Users",
        icon: Users,
        path: "/users",
      },
    ],
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
        path: "/notification",
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
  "/orders": "Orders",
  "/users": "Users",
  "/admin-role": "Admin Role",
  "/wallet": "Wallet",
  // "/admin-role/create": "Create Admin Role",
  "/notification": "Notification",
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

//////orders data
export type OrderStatus = "Approved" | "Pending" | "Cancelled";

export interface Order {
  id: string;
  code: string;
  name: string;
  phone: string;
  address: string;
  gender: "Male" | "Female";
  rating: number; // 0–5
  status: OrderStatus;
  amount: number;
  pickup: string;
  dropoff: string;
  date: string;
  vehicle: string;
  paymentMethod: "Cash" | "Card" | "Wallet";
}

export const ORDER_SUMMARY = {
  total: 45,
  active: 22,
  cancelled: 55,
};

export const ORDERS: Order[] = [
  {
    id: "o1",
    code: "VA-12345",
    name: "David Demo",
    phone: "09083456987",
    address: "Abraham Adesanya, Ajah Lagos",
    gender: "Male",
    rating: 5,
    status: "Approved",
    amount: 4200,
    pickup: "Abraham Adesanya, Ajah Lagos",
    dropoff: "Lekki Phase 1, Lagos",
    date: "06/04/2022",
    vehicle: "Toyota Camry 2020",
    paymentMethod: "Card",
  },
  {
    id: "o2",
    code: "VA-12346",
    name: "David Demo",
    phone: "09083456988",
    address: "Abraham Adesanya, Ajah Lagos",
    gender: "Male",
    rating: 4,
    status: "Pending",
    amount: 3100,
    pickup: "Abraham Adesanya, Ajah Lagos",
    dropoff: "Victoria Island, Lagos",
    date: "06/04/2022",
    vehicle: "Kia Rio 2019",
    paymentMethod: "Cash",
  },
  {
    id: "o3",
    code: "VA-12347",
    name: "Grace Effiong",
    phone: "08123456701",
    address: "Chevron Drive, Lekki Lagos",
    gender: "Female",
    rating: 3,
    status: "Cancelled",
    amount: 5600,
    pickup: "Chevron Drive, Lekki Lagos",
    dropoff: "Ikeja GRA, Lagos",
    date: "07/04/2022",
    vehicle: "Honda Accord 2018",
    paymentMethod: "Wallet",
  },
  {
    id: "o4",
    code: "VA-12348",
    name: "Musa Bello",
    phone: "07098765432",
    address: "Wuse 2, Abuja",
    gender: "Male",
    rating: 5,
    status: "Approved",
    amount: 2800,
    pickup: "Wuse 2, Abuja",
    dropoff: "Maitama, Abuja",
    date: "07/04/2022",
    vehicle: "Toyota Corolla 2021",
    paymentMethod: "Card",
  },
  {
    id: "o5",
    code: "VA-12349",
    name: "Ada Okeke",
    phone: "08034567890",
    address: "Independence Layout, Enugu",
    gender: "Female",
    rating: 4,
    status: "Pending",
    amount: 3900,
    pickup: "Independence Layout, Enugu",
    dropoff: "New Haven, Enugu",
    date: "08/04/2022",
    vehicle: "Hyundai Elantra 2020",
    paymentMethod: "Cash",
  },
  {
    id: "o6",
    code: "VA-12350",
    name: "Tunde Balogun",
    phone: "09011223344",
    address: " Agodi, Ibadan",
    gender: "Male",
    rating: 2,
    status: "Cancelled",
    amount: 4500,
    pickup: "Agodi, Ibadan",
    dropoff: "Bodija, Ibadan",
    date: "08/04/2022",
    vehicle: "Nissan Almera 2017",
    paymentMethod: "Wallet",
  },
  {
    id: "o7",
    code: "VA-12351",
    name: "Chioma Nwosu",
    phone: "08155667788",
    address: "Trans Amadi, Port Harcourt",
    gender: "Female",
    rating: 5,
    status: "Approved",
    amount: 6100,
    pickup: "Trans Amadi, Port Harcourt",
    dropoff: "GRA Phase 2, Port Harcourt",
    date: "09/04/2022",
    vehicle: "Toyota Camry 2022",
    paymentMethod: "Card",
  },
  {
    id: "o8",
    code: "VA-12352",
    name: "Ibrahim Sani",
    phone: "07022334455",
    address: "Nassarawa, Kano",
    gender: "Male",
    rating: 3,
    status: "Pending",
    amount: 2400,
    pickup: "Nassarawa, Kano",
    dropoff: "Sabon Gari, Kano",
    date: "09/04/2022",
    vehicle: "Kia Cerato 2019",
    paymentMethod: "Cash",
  },
];

// Dummy data for the Users page.
export const USER_SUMMARY = {
  total: 0,
  active: 50,
  suspended: 100,
};

export const USERS: User[] = [
  {
    id: "u1",
    name: "David Demo",
    email: "david.demo@example.com",
    contact: "09123456887",
    code: "Vlk-12345",
    date: "06/04/2022",
    status: "Approved",
    role: "Rider",
    gender: "Male",
    address: "Abraham Adesanya, Ajah Lagos",
  },
  {
    id: "u2",
    name: "Grace Effiong",
    email: "grace.effiong@example.com",
    contact: "08123456701",
    code: "Vlk-12346",
    date: "06/04/2022",
    status: "Canceled",
    role: "Driver",
    gender: "Female",
    address: "Chevron Drive, Lekki Lagos",
  },
  {
    id: "u3",
    name: "Musa Bello",
    email: "musa.bello@example.com",
    contact: "07098765432",
    code: "Vlk-12347",
    date: "06/04/2022",
    status: "Pending",
    role: "Rider",
    gender: "Male",
    address: "Wuse 2, Abuja",
  },
  {
    id: "u4",
    name: "Ada Okeke",
    email: "ada.okeke@example.com",
    contact: "08034567890",
    code: "Vlk-12348",
    date: "07/04/2022",
    status: "Canceled",
    role: "Rider",
    gender: "Female",
    address: "Independence Layout, Enugu",
  },
  {
    id: "u5",
    name: "Tunde Balogun",
    email: "tunde.balogun@example.com",
    contact: "09011223344",
    code: "Vlk-12349",
    date: "07/04/2022",
    status: "Pending",
    role: "Driver",
    gender: "Male",
    address: "Agodi, Ibadan",
  },
  {
    id: "u6",
    name: "Chioma Nwosu",
    email: "chioma.nwosu@example.com",
    contact: "08155667788",
    code: "Vlk-12350",
    date: "08/04/2022",
    status: "Approved",
    role: "Rider",
    gender: "Female",
    address: "Trans Amadi, Port Harcourt",
  },
];
