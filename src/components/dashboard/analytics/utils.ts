import { FinancePoint } from "../../../types/index.types";

export const GOLD = "#F5C518";
export const NAVY = "#0A1F44";
export const MUTED_BAR = "rgba(120,130,150,0.18)";

export const EMPTY_PERIODS: FinancePoint[] = [
  { period: "Jan", amount: 0 },
  { period: "Feb", amount: 0 },
  { period: "Mar", amount: 0 },
  { period: "Apr", amount: 0 },
  { period: "May", amount: 0 },
  { period: "Jun", amount: 0 },
];

export interface ChartPoint extends FinancePoint {
  isPeak?: boolean;
  isPlaceholder?: boolean;
}

export const formatCompactCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return `₦${(
      value / 1_000_000
    ).toFixed(value >= 10_000_000 ? 0 : 1)}m`;
  }

  if (value >= 1_000) {
    return `₦${(
      value / 1_000
    ).toFixed(value >= 100_000 ? 0 : 1)}k`;
  }

  return `₦${value.toLocaleString()}`;
};

export const formatFullCurrency = (value: number): string => {
  return `₦${value.toLocaleString()}`;
};

export const prepareChartData = (
  points: FinancePoint[]
): ChartPoint[] => {
  if (points.length === 0) {
    return EMPTY_PERIODS.map((item) => ({
      ...item,
      isPlaceholder: true,
    }));
  }

  const peak = Math.max(
    ...points.map((point) => point.amount || 0)
  );

  return points.map((point) => ({
    ...point,
    amount: point.amount || 0,
    isPeak: point.amount === peak && peak > 0,
  }));
};

export const calculateTotalSpending = (
  points: FinancePoint[]
): number => {
  return points.reduce(
    (total, point) => total + (point.amount || 0),
    0
  );
};

export const findPeakPoint = (
  points: FinancePoint[]
): FinancePoint | null => {
  if (!points.length) return null;

  return points.reduce((highest, current) =>
    current.amount > highest.amount
      ? current
      : highest
  );
};

export const hasFinancialData = (
  points: FinancePoint[]
): boolean => {
  return points.some(
    (point) => Number(point.amount) > 0
  );
};

export const calculateYAxisMax = (
  chartData: ChartPoint[]
): number => {
  const maxAmount = Math.max(
    ...chartData.map((point) => point.amount),
    0
  );

  return maxAmount > 0
    ? Math.ceil(maxAmount * 1.2)
    : 100;
};