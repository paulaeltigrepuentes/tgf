// ============================================================================
// Presentation Formatting Helpers
// ----------------------------------------------------------------------------
// IMPORTANT: Rounding for display happens ONLY here. The calculation engine
// never rounds intermediate values.
// ============================================================================

type CurrencyCode = 'COP' | 'USD' | 'EUR';

const CURRENCY_LOCALE: Record<CurrencyCode, string> = {
  COP: 'es-CO',
  USD: 'en-US',
  EUR: 'de-DE',
};

/**
 * Format a monetary value for display.
 * COP is shown with 0 decimals; USD/EUR with 2 decimals.
 */
export function formatCurrency(value: number, currency: CurrencyCode): string {
  if (!Number.isFinite(value)) return '—';
  const fractionDigits = currency === 'COP' ? 0 : 2;
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Format a plain number with grouping. */
export function formatNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Format a decimal ratio (e.g. 0.15) as a percentage string (e.g. "15.0%"). */
export function formatPercent(ratio: number, decimals = 1): string {
  if (!Number.isFinite(ratio)) return '—';
  return `${(ratio * 100).toFixed(decimals)}%`;
}
