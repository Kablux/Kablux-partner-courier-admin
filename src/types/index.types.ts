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