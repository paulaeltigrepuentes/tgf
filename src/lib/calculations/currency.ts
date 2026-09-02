// ============================================================================
// Currency Conversion - ColCom Trade Calculation Engine
// ============================================================================

import type { Currency, ExchangeRatesInput } from './types';

/**
 * Convert COP to USD.
 * @param cop - Amount in COP
 * @param rates - Exchange rates containing usdCop (TRM USD/COP)
 * @returns Amount in USD
 */
export function copToUsd(cop: number, rates: ExchangeRatesInput): number {
  return cop / rates.usdCop;
}

/**
 * Convert COP to EUR.
 * @param cop - Amount in COP
 * @param rates - Exchange rates containing eurCop (TRM EUR/COP)
 * @returns Amount in EUR
 */
export function copToEur(cop: number, rates: ExchangeRatesInput): number {
  return cop / rates.eurCop;
}

/**
 * Convert USD to COP.
 * @param usd - Amount in USD
 * @param rates - Exchange rates containing usdCop (TRM USD/COP)
 * @returns Amount in COP
 */
export function usdToCop(usd: number, rates: ExchangeRatesInput): number {
  return usd * rates.usdCop;
}

/**
 * Convert EUR to COP.
 * @param eur - Amount in EUR
 * @param rates - Exchange rates containing eurCop (TRM EUR/COP)
 * @returns Amount in COP
 */
export function eurToCop(eur: number, rates: ExchangeRatesInput): number {
  return eur * rates.eurCop;
}

/**
 * Convert USD to EUR via COP cross rate.
 * @param usd - Amount in USD
 * @param rates - Exchange rates
 * @returns Amount in EUR
 */
export function usdToEur(usd: number, rates: ExchangeRatesInput): number {
  const cop = usdToCop(usd, rates);
  return copToEur(cop, rates);
}

/**
 * Convert EUR to USD via COP cross rate.
 * @param eur - Amount in EUR
 * @param rates - Exchange rates
 * @returns Amount in USD
 */
export function eurToUsd(eur: number, rates: ExchangeRatesInput): number {
  const cop = eurToCop(eur, rates);
  return copToUsd(cop, rates);
}

/**
 * Generic currency conversion.
 * Converts an amount from one currency to another using the provided rates.
 * All conversions route through COP as the base currency.
 *
 * @param amount - The amount to convert
 * @param from - Source currency
 * @param to - Target currency
 * @param rates - Exchange rates
 * @returns Converted amount in target currency
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  rates: ExchangeRatesInput
): number {
  if (from === to) return amount;

  // Convert to COP first
  let cop: number;
  switch (from) {
    case 'COP':
      cop = amount;
      break;
    case 'USD':
      cop = usdToCop(amount, rates);
      break;
    case 'EUR':
      cop = eurToCop(amount, rates);
      break;
  }

  // Convert from COP to target
  switch (to) {
    case 'COP':
      return cop;
    case 'USD':
      return copToUsd(cop, rates);
    case 'EUR':
      return copToEur(cop, rates);
  }
}
