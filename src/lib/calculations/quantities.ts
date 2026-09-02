// ============================================================================
// Quantity Calculations - ColCom Trade Calculation Engine
// ============================================================================

import type { CaliberLineInput } from './types';

/**
 * Calculate kilos for a single line.
 * kilos = boxes * kgPerBox
 *
 * @param boxes - Number of boxes
 * @param kgPerBox - Weight per box in kg
 * @returns Total kilos for this line
 */
export function calculateKilos(boxes: number, kgPerBox: number): number {
  return boxes * kgPerBox;
}

/**
 * Calculate total kilos across all caliber lines.
 * totalKilos = SUM(kilos of all lines)
 *
 * @param lines - Array of caliber line inputs
 * @returns Total kilos
 */
export function calculateTotalKilos(lines: CaliberLineInput[]): number {
  return lines.reduce((sum, line) => sum + calculateKilos(line.boxes, line.kgPerBox), 0);
}

/**
 * Calculate total boxes across all caliber lines.
 * totalCajas = SUM(boxes of all lines)
 *
 * @param lines - Array of caliber line inputs
 * @returns Total boxes
 */
export function calculateTotalBoxes(lines: CaliberLineInput[]): number {
  return lines.reduce((sum, line) => sum + line.boxes, 0);
}
