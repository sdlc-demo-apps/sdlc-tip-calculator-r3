export const DASH = "—";

// Formats integer cents as USD, e.g. 123450 -> "$1,234.50". null -> "—".
export function formatUSD(cents) {
  if (cents === null || cents === undefined) return DASH;
  const dollars = Math.floor(cents / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const rest = String(cents % 100).padStart(2, "0");
  return `$${dollars}.${rest}`;
}
