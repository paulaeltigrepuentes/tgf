// ============================================================================
// CIF Cost & Sale Price Calculations - ColCom Trade Calculation Engine
// ============================================================================

import type { ExchangeRatesInput, FreightInput, InsuranceInput, Currency } from './types';
import { calculateSalePriceFromMargin } from './profit';
import { copToEur, convertCurrency } from './currency';

/**
 * Calculate total freight cost.
 * fleteMaritimo = fletePorContenedor * numeroContenedores
 *
 * @param freight - Freight configuration
 * @returns Total freight cost in USD
 */
export function calculateFreight(freight: FreightInput): number {
  return freight.fletePorContenedor * freight.numeroContenedores;
}

/**
 * Calculate total insurance cost, converted to COP.
 *
 * The insurance value may be in any currency (typically USD).
 * It must be converted to COP for inclusion in CIF calculations.
 *
 * @param insurance - Insurance configuration
 * @param rates - Exchange rates
 * @returns Insurance cost in COP
 */
export function calculateInsuranceInCOP(
  insurance: InsuranceInput,
  rates: ExchangeRatesInput
): number {
  return convertCurrency(insurance.valor, insurance.currency, 'COP', rates);
}

/**
 * Calculate total CIF cost.
 *
 * costoCIF = costoFOB + fleteMaritimo + seguroMaritimo
 *
 * All components must be in the same currency (COP) before adding.
 * Freight is in USD, so it must be converted to COP.
 * Insurance may be in any currency, so it must be converted to COP.
 *
 * @param fobCost - FOB cost in COP
 * @param freightCOP - Freight cost in COP
 * @param insuranceCOP - Insurance cost in COP
 * @returns Total CIF cost in COP
 */
export function calculateCIFCost(
  fobCost: number,
  freightCOP: number,
  insuranceCOP: number
): number {
  return fobCost + freightCOP + insuranceCOP;
}

/**
 * Calculate CIF cost per kilo.
 * costoCIFPorKg = costoCIF / kilos
 *
 * @param cifCost - Total CIF cost in COP
 * @param totalKilos - Total kilos
 * @returns CIF cost per kg in COP
 */
export function calculateCIFCostPerKg(cifCost: number, totalKilos: number): number {
  if (totalKilos === 0) return 0;
  return cifCost / totalKilos;
}

/**
 * Calculate CIF cost per kg for a specific caliber line.
 *
 * costoCIF_COP_KG = precioCompraKg + costoOperativoFOBPorKg + fleteMaritimoPorKg + seguroMaritimoPorKg
 *
 * @param purchasePricePerKgCOP - Purchase price per kg in COP
 * @param operatingCostFOBPerKg - Operating cost FOB per kg in COP
 * @param freightPerKgCOP - Freight per kg in COP
 * @param insurancePerKgCOP - Insurance per kg in COP
 * @returns CIF cost per kg in COP
 */
export function calculateCIFCostPerKgForLine(
  purchasePricePerKgCOP: number,
  operatingCostFOBPerKg: number,
  freightPerKgCOP: number,
  insurancePerKgCOP: number
): number {
  return purchasePricePerKgCOP + operatingCostFOBPerKg + freightPerKgCOP + insurancePerKgCOP;
}

/**
 * Calculate CIF cost per kg in EUR for a specific caliber line.
 *
 * costoCIF_EUR_KG = costoCIF_COP_KG / EUR_COP
 *
 * @param cifCostPerKgCOP - CIF cost per kg in COP
 * @param rates - Exchange rates
 * @returns CIF cost per kg in EUR
 */
export function calculateCIFCostPerKgEURForLine(
  cifCostPerKgCOP: number,
  rates: ExchangeRatesInput
): number {
  return copToEur(cifCostPerKgCOP, rates);
}

/**
 * Calculate CIF sale price per kg in EUR for a specific caliber line.
 *
 * Uses MARGIN (not markup):
 *   ventaCIF_EUR_KG = costoCIF_EUR_KG / (1 - margen)
 *
 * @param cifCostPerKgEUR - CIF cost per kg in EUR
 * @param marginPct - Margin percentage (e.g. 0.15 for 15%)
 * @returns CIF sale price per kg in EUR
 */
export function calculateCIFSalePricePerKgEUR(
  cifCostPerKgEUR: number,
  marginPct: number
): number {
  return calculateSalePriceFromMargin(cifCostPerKgEUR, marginPct);
}

/**
 * Calculate CIF sale price per box in EUR.
 *
 * salePricePerBox = salePricePerKg * kgPerBox
 *
 * @param cifSalePricePerKgEUR - CIF sale price per kg in EUR
 * @param kgPerBox - Weight per box in kg
 * @returns CIF sale price per box in EUR
 */
export function calculateCIFSalePricePerBoxEUR(
  cifSalePricePerKgEUR: number,
  kgPerBox: number
): number {
  return cifSalePricePerKgEUR * kgPerBox;
}

/**
 * Calculate CIF subtotal for a line.
 * subtotalLinea = precioUnitario * cantidadCajas
 *
 * @param cifSalePricePerBoxEUR - CIF sale price per box in EUR
 * @param boxes - Number of boxes
 * @returns CIF subtotal in EUR
 */
export function calculateCIFSubtotalEUR(
  cifSalePricePerBoxEUR: number,
  boxes: number
): number {
  return cifSalePricePerBoxEUR * boxes;
}

/**
 * Calculate CIF profit for a line.
 * utilidadLinea = ventaLinea - costoLinea
 *
 * @param cifSubtotalEUR - CIF sale subtotal in EUR
 * @param cifCostPerKgEUR - CIF cost per kg in EUR
 * @param kilos - Kilos for this line
 * @returns CIF profit in EUR
 */
export function calculateCIFProfitEUR(
  cifSubtotalEUR: number,
  cifCostPerKgEUR: number,
  kilos: number
): number {
  return cifSubtotalEUR - (cifCostPerKgEUR * kilos);
}
