export type OrderGroup = "pending" | "active" | "completed" | "cancelled";

export const EMPTY_VALUE = "—";

export const GROUP_COLORS: Record<OrderGroup, string> = {
  pending: "#D9A400",
  active: "#3B82F6",
  completed: "#22C55E",
  cancelled: "#EF4444",
};


export const getOrderGroup = (status?: string | null): OrderGroup | null => {
  const value = (status ?? "").toUpperCase();

  if (!value) return null;
  if (/CANCEL|FAIL|REJECT|EXPIRE|RETURN/.test(value)) return "cancelled";
  if (/DELIVERED|COMPLETE/.test(value)) return "completed";
  if (/PENDING/.test(value)) return "pending";
  return "active";
};

export const formatEnum = (value?: string | null): string => {
  if (!value) return EMPTY_VALUE;
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatMoney = (value?: number | string | null): string => {
  if (value === null || value === undefined || value === "") return EMPTY_VALUE;
  const amount = Number(value);
  return Number.isNaN(amount) ? EMPTY_VALUE : `₦${amount.toLocaleString()}`;
};

export const formatDateTime = (value?: string | null): string => {
  if (!value) return EMPTY_VALUE;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return EMPTY_VALUE;
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
