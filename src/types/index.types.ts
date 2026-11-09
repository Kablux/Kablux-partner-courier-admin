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

////Orders
// Swagger only shows the first value of each enum, so the status, category,
// priority and vehicle fields stay as strings instead of guessed unions.
export interface OrderStop {
  address: string;
  latitude: number;
  longitude: number;
}

export interface OrderLineItem {
  name: string;
  price: number;
}

export interface OrderRider {
  id: string;
  full_name: string;
  phone: string;
  rating: number;
  vehicle_type: string;
  plate_number: string;
}

export interface OrderDelivery {
  id: string;
  status: string;
  current_stage: string;
  pickup_code: string;
  dropoff_code: string;
  rider: OrderRider | null;
}

export interface OrderPackage {
  description: string | null;
  quantity: number | null;
  weight_kg: number | null;
  declared_value: number | null;
  fragile: boolean;
}

/** Fields shared by the list and detail responses. */
interface OrderBase {
  id: string;
  /** Internal order status. */
  status: string;
  order_code: string;
  reference: string;
  category: string;
  priority: string;
  preferred_delivery_vehicle_type: string;
  payment_on_delivery: boolean;
  delivery_instructions: string;
  has_stop: boolean;
  stop_info: OrderStop[];
  items: OrderLineItem[];
  pickup_contact: string;
  recipient_contact: string;
  vendor_address: string;
  vendor_latitude: number;
  vendor_longitude: number;
  recipient_address: string;
  recipient_latitude: number;
  recipient_longitude: number;
  scheduled_pickup_time: string | null;
  scheduled_delivery_time: string | null;
  created_at: string;
}

/** Fields only seen on the list response so far. */
interface OrderListExtras {
  team_id: string;
  order_id: string;
  pickup_contact_name: string | null;
  recipient_name: string | null;
  initial_proposed_offer: number | null;
  external_reference: string | null;
  metadata: Record<string, unknown>;
  payment_method: string;
  package: OrderPackage | null;
  order_source: string;
}

export interface OrderListItem extends OrderBase, OrderListExtras {}

export interface OrderDetail extends OrderBase, Partial<OrderListExtras> {
  /** Status in the partner webhook vocabulary. */
  partner_status: string;
  price: number;
  updated_at: string;
  /** Null until a rider accepts. */
  delivery: OrderDelivery | null;
}

export interface OrdersPageData {
  count: number;
  page: number;
  page_size: number;
  results: OrderListItem[];
}

export interface OrdersResponse {
  success?: boolean;
  message?: string;
  data?: OrdersPageData;
}

export interface OrdersListData {
  results: OrderListItem[];
  count: number;
}

export interface OrderDetailResponse {
  success?: boolean;
  data?: OrderDetail;
}

////API keys
export interface ApiKey {
  id: string;
  name: string;
  /** The visible start of the key. The secret itself is never listed. */
  prefix: string;
  created: string;
  revoked: boolean;
  expiry_date: string | null;
  last_used_at: string | null;
}

/** Only the create response carries the full key, and only once. */
export interface CreatedApiKey extends ApiKey {
  key: string;
}

export interface ApiKeysResponse {
  success?: boolean;
  data?: ApiKey[];
}

export interface CreateApiKeyResponse {
  success?: boolean;
  data?: CreatedApiKey;
}

////Webhook endpoint
/** What the panel keeps. The signing secret is never stored. */
export interface WebhookEndpoint {
  endpoint_id: string;
  url: string;
  enabled: boolean;
}

export interface WebhookEndpointPayload extends WebhookEndpoint {
  /** Only present when the receiver is first created. */
  webhook_secret?: string | null;
}

export interface WebhookEndpointResponse {
  success?: boolean;
  /** Null when no receiver has been set. */
  data?: WebhookEndpointPayload | null;
}

export interface SaveWebhookResult {
  endpoint: WebhookEndpoint;
  /** The signing secret, returned once on first creation; otherwise null. */
  secret: string | null;
}

////TeamMember
export interface TeamMember {
  id: string; 
  user_id: string;
  team_id: string;
  role: "OWNER" | "MEMBER" | string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  created_at: string;
}

export interface AddMemberPayload {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  country_code: string;
}