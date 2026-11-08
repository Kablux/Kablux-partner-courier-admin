export const EMPTY_VALUE = "—";

/** 21 Sept 2026 */
export const formatDate = (value?: string | null): string => {
  if (!value) return EMPTY_VALUE;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return EMPTY_VALUE;
  return date.toLocaleDateString("en-NG", { dateStyle: "medium" });
};

/** 21 Sept 2026, 07:47 */
export const formatDateTime = (value?: string | null): string => {
  if (!value) return EMPTY_VALUE;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return EMPTY_VALUE;
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
