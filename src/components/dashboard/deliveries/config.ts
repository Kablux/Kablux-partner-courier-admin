export interface DeliveryStatusConfig {
  label: string;
  color: string;
}

export const STATUS_CONFIG: Record<string, DeliveryStatusConfig> = {
  PENDING: {
    label: "Pending",
    color: "#F5C518",
  },

  IN_PROGRESS: {
    label: "In Progress",
    color: "#3B82F6",
  },

  DELIVERED: {
    label: "Delivered",
    color: "#22C55E",
  },

  CANCELLED: {
    label: "Cancelled",
    color: "#94A3B8",
  },

  FAILED: {
    label: "Failed",
    color: "#EF4444",
  },

  RETURNED: {
    label: "Returned",
    color: "#8B5CF6",
  },
};

export const EMPTY_RING_COLOR = "rgba(120,130,150,0.12)";

export const formatStatus = (status: string): string => {
  const config = STATUS_CONFIG[status];

  if (config) {
    return config.label;
  }

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const getStatusColor = (status: string): string => {
  return STATUS_CONFIG[status]?.color || "#94A3B8";
};