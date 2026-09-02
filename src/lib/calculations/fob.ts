// ============================================================================
// FOB Cost & Sale Price Calculations - ColCom Trade Calculation Engine
// ============================================================================

import type { CaliberLineInput, ExchangeRatesInput, OperatingCostsBreakdown } from './types';
import { calculateSalePriceFromMargin } from './profit';
import { copToEur } from './currency';

/**
 * Calculate total FOB cost.
 *
 * From the Excel:
 *   E26 = SUM(E13:E24)  → operating costs base
 *   E27 = E26 * porcentajeImprevistos  → contingency
 *   E28 = E26 + E27  → total operating costs (this is the operating cost component)
 *
 *   costosOperativosBase = operatingCostsBase + contingency
 *   costoFOB = costosOperativosBase + costoDeFruta + imprevistos
 *
 * IMPORTANT: The Excel defines:
 *   costoFOB = costos operativos + costo de fruta + imprevistos
 *
 * Where "costos operativos" (E26) is the sum BEFORE contingency,
 * and "imprevistos" (E27) is the contingency.
 * So: costoFOB = E26 + E27 + fruitCost = operatingCostsBase + contingency + fruitCost
 *
 * @param operatingCostsBase - Sum of operating cost components (E26)
 * @param contingency - Contingency amount (E27)
 * @param fruitCost - Total fruit purchase cost
 * @returns Total FOB cost in COP
 */
export function calculateFOBCost(
  operatingCostsBase: number,
  contingency: number,
  fruitCost: number
): number {
  return operatingCostsBase + contingency + fruitCost;
}

/**
 * Calculate FOB cost per kilo.
 * costoFOBPorKg = costoFOB / kilos
 *
 * @param fobCost - Total FOB cost in COP
 * @param totalKilos - Total kilos
 * @returns FOB cost per kg in COP
 */
export function calculateFOBCostPerKg(fobCost: number, totalKilos: number): number {
  if (totalKilos === 0) return 0;
  return fobCost / totalKilos;
}

/**
 * Calculate the operating cost component of FOB per kilo.
 *
 * This is the Excel L8 value: operating costs (base + contingency) per kilo.
 * L8 = (E26 + E27) / kilos
 *
 * @param operatingCostsBase - Base operating costs (E26)
 * @param contingency - Contingency (E27)
 * @param totalKilos - Total kilos
 * @returns Operating cost per kg in COP
 */
export function calculateOperatingCostFOBPerKg(
  operatingCostsBase: number,
  contingency: number,
  totalKilos: number
): number {
  if (totalKilos === 0) return 0;
  return (operatingCostsBase + contingency) / totalKilos;
}

/**
 * Calculate FOB cost per kg for a specific caliber line.
 *
 * From the Excel:
 *   P21 = L8 + O21
 * where:
 *   L8 = operating cost FOB per kg (COP)
 *   O21 = purchase price per kg for this caliber (COP)
 *
 * FOB_COP_KG = precioCompraKg + costoOperativoFOBPorKg
 *
 * @param purchasePricePerKgCOP - Purchase price per kg in COP for this caliber
 * @param operatingCostFOBPerKg - Operating cost FOB per kg in COP
 * @returns FOB cost per kg in COP
 */
export function calculateFOBCostPerKgForLine(
  purchasePricePerKgCOP: number,
  operatingCostFOBPerKg: number
): number {
  return purchasePricePerKgCOP + operatingCostFOBPerKg;
}

/**
 * Calculate FOB cost per kg in EUR for a specific caliber line.
 *
 * From the Excel:
 *   Q21 = P21 / E3
 * where:
 *   P21 = FOB cost per kg in COP
 *   E3 = TRM EUR/COP
 *
 * FOB_EUR_KG = FOB_COP_KG / EUR_COP
 *
 * @param fobCostPerKgCOP - FOB cost per kg in COP
 * @param rates - Exchange rates
 * @returns FOB cost per kg in EUR
 */
export function calculateFOBCostPerKgEURForLine(
  fobCostPerKgCOP: number,
  rates: ExchangeRatesInput
): number {
  return copToEur(fobCostPerKgCOP, rates);
}

/**
 * Calculate FOB sale price per kg in EUR for a specific caliber line.
 *
 * Uses MARGIN (not markup):
 *   sale = cost / (1 - margin)
 *
 * @param fobCostPerKgEUR - FOB cost per kg in EUR
 * @param marginPct - Margin percentage (e.g. 0.15 for 15%)
 * @returns FOB sale price per kg in EUR
 */
export function calculateFOBSalePricePerKgEUR(
  fobCostPerKgEUR: number,
  marginPct: number
): number {
  return calculateSalePriceFromMargin(fobCostPerKgEUR, marginPct);
}

/**
 * Calculate FOB sale price per box in EUR.
 *
 * salePricePerBox = salePricePerKg * kgPerBox
 *
 * @param fobSalePricePerKgEUR - FOB sale price per kg in EUR
 * @param kgPerBox - Weight per box in kg
 * @returns FOB sale price per box in EUR
 */
export function calculateFOBSalePricePerBoxEUR(
  fobSalePricePerKgEUR: number,
  kgPerBox: number
): number {
  return fobSalePricePerKgEUR * kgPerBox;
}

/**
 * Calculate FOB subtotal for a line.
 * subtotalLinea = precioUnitario * cantidadCajas
 *
 * @param fobSalePricePerBoxEUR - FOB sale price per box in EUR
 * @param boxes - Number of boxes
 * @returns FOB subtotal in EUR
 */
export function calculateFOBSubtotalEUR(
  fobSalePricePerBoxEUR: number,
  boxes: number
): number {
  return fobSalePricePerBoxEUR * boxes;
}

/**
 * Calculate FOB profit for a line.
 * utilidadLinea = ventaLinea - costoLinea
 *
 * @param fobSubtotalEUR - FOB sale subtotal in EUR
 * @param fobCostPerKgEUR - FOB cost per kg in EUR
 * @param kilos - Kilos for this line
 * @returns FOB profit in EUR
 */
export function calculateFOBProfitEUR(
  fobSubtotalEUR: number,
  fobCostPerKgEUR: number,
  kilos: number
): number {
  return fobSubtotalEUR - (fobCostPerKgEUR * kilos);
}
