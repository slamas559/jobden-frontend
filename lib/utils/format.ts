import { format, formatDistance, formatRelative } from "date-fns";

export const formatDate = (date: string | Date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), "MMM dd, yyyy HH:mm");
};

export const formatRelativeTime = (date: string | Date) => {
  if (!date) return "Unknown";

  // Convert to string first
  let d = typeof date === "string" ? date : date.toString();

  // Remove microseconds (if any)
  d = d.replace(/\.\d{6}/, "");

  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return "Unknown";

  return formatDistance(parsed, new Date(), { addSuffix: true });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};