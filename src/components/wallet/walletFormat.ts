import { EMPTY_VALUE } from "../../utils/format";

/** Money in the wallet's own currency, e.g. "₦12,500.00". */
export const formatAmount = (amount: number | string | null | undefined, currency = "NGN") => {
  if (amount === null || amount === undefined || amount === "") return EMPTY_VALUE;
  const value = Number(amount);
  if (Number.isNaN(value)) return EMPTY_VALUE;
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    // Unknown currency code: fall back to a plain number with the code.
    return `${currency} ${value.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
  }
};

/** TOP_UP / top-up -> "Top up" */
export const humanizeCode = (value?: string | null) => {
  if (!value) return EMPTY_VALUE;
  const text = value.replace(/[_.-]+/g, " ").trim().toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Money in or out. The direction values aren't documented, so this reads
 * common words; anything else is shown as neutral.
 */
export const directionOf = (direction?: string | null): "in" | "out" | null => {
  const d = (direction || "").toUpperCase();
  if (/(CREDIT|IN|INFLOW|DEPOSIT)/.test(d)) return "in";
  if (/(DEBIT|OUT|OUTFLOW|WITHDRAW|CHARGE)/.test(d)) return "out";
  return null;
};

export type StatusTone = "success" | "pending" | "failed" | "neutral";

export const statusTone = (status?: string | null): StatusTone => {
  const s = (status || "").toUpperCase();
  if (/(SUCCESS|COMPLETE|PAID|SETTLED|CONFIRMED)/.test(s)) return "success";
  if (/(PENDING|PROCESSING|INITIATED|AWAITING)/.test(s)) return "pending";
  if (/(FAIL|CANCEL|REVERS|REJECT|ABANDON|DECLIN)/.test(s)) return "failed";
  return "neutral";
};

export const TONE_COLORS: Record<StatusTone, string> = {
  success: "#16A34A",
  pending: "#D97706",
  failed: "#DC2626",
  neutral: "#64748B",
};
