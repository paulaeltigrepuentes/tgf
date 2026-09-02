// ============================================================================
// Fruit Cost Calculations - ColCom Trade Calculation Engine
// ============================================================================

import type { CaliberLineInput } from './types';

/**
 * Calculate the purchase value for a single caliber line.
 * valorCompraLinea = kilos * precioCompraKg
 *
 * @param kilos - Total kilos for this line
 * @param purchasePricePerKgCOP - Purchase price per kg in COP
 * @returns Purchase value in COP
 */
export function calculateFruitCostLine(kilos: number, purchasePricePerKgCOP: number): number {
  return kilos * purchasePricePerKgCOP;
}

/**
 * Calculate total fruit purchase cost across all lines.
 * totalCompraFruta = SUM(valorCompraLinea)
 *
 * @param lines - Array of caliber line inputs
 * @returns Total fruit cost in COP
 */
export function calculateTotalFruitCost(lines: CaliberLineInput[]): number {
  return lines.reduce((sum, line) => {
    const kilos = line.boxes * line.kgPerBox;
    return sum + calculateFruitCostLine(kilos, line.purchasePricePerKgCOP);
  }, 0);
}

/**
 * Calculate the average purchase price across all caliber lines.
 *
 * This implements the Excel formula: AVERAGE(P6:P16)
 * which is a simple arithmetic average of the purchase prices per kg.
 *
 * IMPORTANT: This is a simple average, NOT a weighted average.
 * The Excel uses AVERAGE() on the price column directly.
 * Do not replace with weighted average without explicit authorization.
 *
 * @param lines - Array of caliber line inputs
 * @returns Average purchase price per kg in COP
 */
export function calculateAveragePurchasePrice(lines: CaliberLineInput[]): number {
  if (lines.length === 0) return 0;
  const sum = lines.reduce((acc, line) => acc + line.purchasePricePerKgCOP, 0);
  return sum / lines.length;
}
