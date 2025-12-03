import { format, formatDistance, formatRelative } from "date-fns";

export const formatDate = (date: string | Date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), "MMM dd, yyyy HH:mm");
};

export const formatRelativeTime = (date: string | Date) => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};