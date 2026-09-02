// ============================================================================
// Profit & Margin Calculations - ColCom Trade Calculation Engine
// ============================================================================

/**
 * Calculate sale price from cost using MARGIN (not markup).
 *
 * The Excel uses MARGIN on sale price, NOT markup on cost.
 *
 * margin = (sale - cost) / sale
 * Therefore: sale = cost / (1 - margin)
 *
 * Example:
 *   cost = 85, margin = 15% (0.15)
 *   sale = 85 / (1 - 0.15) = 85 / 0.85 = 100
 *   profit = 100 - 85 = 15
 *   margin = 15 / 100 = 15% ✓
 *
 * DO NOT use: cost * (1 + margin) — that is markup, which is incorrect.
 *
 * @param cost - Cost amount
 * @param marginPct - Margin percentage (e.g. 0.15 for 15%)
 * @returns Sale price
 */
export function calculateSalePriceFromMargin(cost: number, marginPct: number): number {
  return cost / (1 - marginPct);
}

/**
 * Calculate profit for a single line.
 * utilidadLinea = ventaLinea - costoLinea
 *
 * @param sale - Sale amount
 * @param cost - Cost amount
 * @returns Profit
 */
export function calculateProfit(sale: number, cost: number): number {
  return sale - cost;
}

/**
 * Calculate total profit across all lines.
 * utilidadTotal = SUM(utilidadLinea)
 *
 * @param profits - Array of individual line profits
 * @returns Total profit
 */
export function calculateTotalProfit(profits: number[]): number {
  return profits.reduce((sum, p) => sum + p, 0);
}

/**
 * Calculate consolidated margin.
 *
 * margenConsolidado = (ventaTotal - costoTotal) / ventaTotal
 *                    = utilidadTotal / ventaTotal
 *
 * This is calculated on TOTALS, NOT as a simple average of per-line margins.
 *
 * @param totalSale - Total sale amount
 * @param totalCost - Total cost amount
 * @returns Consolidated margin as a decimal (e.g. 0.15 for 15%)
 */
export function calculateConsolidatedMargin(totalSale: number, totalCost: number): number {
  if (totalSale === 0) return 0;
  return (totalSale - totalCost) / totalSale;
}
