// ============================================================================
// National Sale Calculations - ColCom Trade Calculation Engine
// ============================================================================

import type { CaliberLineInput, NationalSaleInput } from './types';
import { calculateAveragePurchasePrice } from './fruit';

/**
 * Calculate the national purchase price.
 *
 * precioCompraNacional = precioPromedioCompra - (precioPromedioCompra * porcentajeDescuento)
 *
 * In the Excel: porcentajeDescuento = 10%
 *
 * @param averagePurchasePrice - Average purchase price per kg in COP
 * @param porcentajeDescuento - Discount percentage (e.g. 0.10 for 10%)
 * @returns National purchase price per kg in COP
 */
export function calculateNationalPurchasePrice(
  averagePurchasePrice: number,
  porcentajeDescuento: number
): number {
  return averagePurchasePrice - (averagePurchasePrice * porcentajeDescuento);
}

/**
 * Calculate the national sale price.
 *
 * precioVentaNacional = precioCompraNacional + (precioCompraNacional * porcentaje)
 *
 * In the Excel: porcentaje = 10%
 *
 * @param precioCompraNacional - National purchase price per kg in COP
 * @param porcentajeVenta - Sale percentage (e.g. 0.10 for 10%)
 * @returns National sale price per kg in COP
 */
export function calculateNationalSalePrice(
  precioCompraNacional: number,
  porcentajeVenta: number
): number {
  return precioCompraNacional + (precioCompraNacional * porcentajeVenta);
}

/**
 * Calculate total national sale revenue.
 *
 * totalVentaNacional = kilosVendidos * precioVentaNacional
 *
 * @param kilosVendidos - Kilos sold nationally
 * @param precioVentaNacional - National sale price per kg in COP
 * @returns Total national sale revenue in COP
 */
export function calculateTotalNationalSale(
  kilosVendidos: number,
  precioVentaNacional: number
): number {
  return kilosVendidos * precioVentaNacional;
}

/**
 * Calculate total national purchase cost.
 *
 * totalCompraNacional = kilosVendidos * precioCompraNacional
 *
 * @param kilosVendidos - Kilos sold nationally
 * @param precioCompraNacional - National purchase price per kg in COP
 * @returns Total national purchase cost in COP
 */
export function calculateTotalNationalPurchase(
  kilosVendidos: number,
  precioCompraNacional: number
): number {
  return kilosVendidos * precioCompraNacional;
}

/**
 * Calculate national profit.
 *
 * utilidadNacional = totalVentaNacional - totalCompraNacional
 *
 * @param totalVentaNacional - Total national sale revenue in COP
 * @param totalCompraNacional - Total national purchase cost in COP
 * @returns National profit in COP
 */
export function calculateNationalProfit(
  totalVentaNacional: number,
  totalCompraNacional: number
): number {
  return totalVentaNacional - totalCompraNacional;
}

/**
 * Calculate the complete national sale result.
 *
 * This function orchestrates all national sale calculations:
 * 1. Calculate average purchase price from caliber lines
 * 2. Apply discount to get national purchase price
 * 3. Apply markup to get national sale price
 * 4. Calculate total sale and purchase
 * 5. Calculate profit
 *
 * @param lines - Caliber line inputs (for average purchase price)
 * @param nationalSale - National sale configuration
 * @returns Complete national sale result
 */
export function calculateNationalSale(
  lines: CaliberLineInput[],
  nationalSale: NationalSaleInput
) {
  const averagePurchasePrice = calculateAveragePurchasePrice(lines);

  const precioCompraNacional = calculateNationalPurchasePrice(
    averagePurchasePrice,
    nationalSale.porcentajeDescuento
  );

  const precioVentaNacional = calculateNationalSalePrice(
    precioCompraNacional,
    nationalSale.porcentajeVenta
  );

  const totalVentaNacional = calculateTotalNationalSale(
    nationalSale.kilosVendidos,
    precioVentaNacional
  );

  const totalCompraNacional = calculateTotalNationalPurchase(
    nationalSale.kilosVendidos,
    precioCompraNacional
  );

  const utilidadNacional = calculateNationalProfit(
    totalVentaNacional,
    totalCompraNacional
  );

  return {
    averagePurchasePrice,
    precioCompraNacional,
    precioVentaNacional,
    totalVentaNacional,
    totalCompraNacional,
    utilidadNacional,
  };
}
