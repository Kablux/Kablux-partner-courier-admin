export interface DashboardSummary {
  total_rides: number;
  total_spendings: number;
  total_users: number;
}

export interface FinancePoint {
  period: string;
  amount: number;
}

export type DeliveryStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED"
  | "RETURNED";
  
export interface DeliverySlice {
  status: DeliveryStatus;
  count: number;
}

export interface DashboardFinancials {
  granularity: string;
  points: FinancePoint[];
}

export interface DashboardDeliveries {
  slices: DeliverySlice[];
}

export interface DashboardData {
  summary: DashboardSummary;
  financials: DashboardFinancials;
  deliveries: DashboardDeliveries;
}

export interface NotificationItem {
  id: string;
  notification_type: string;
  priority: string;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationsListData {
  count: number;
  page: number;
  page_size: number;
  results: NotificationItem[];
}

export interface NotificationsResponse {
  success?: boolean;
  message?: string;
  data?: NotificationsListData;
  [key: string]: unknown;
}

export type NotificationReadFilter = "all" | "read" | "unread";

export interface NotificationsQueryParams {
  is_read?: boolean;
  page?: number;
  page_size?: number;
}