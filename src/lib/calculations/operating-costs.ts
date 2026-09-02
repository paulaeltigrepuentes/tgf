// ============================================================================
// Operating Costs Calculations - ColCom Trade Calculation Engine
// ============================================================================

import type { OperatingCostsInput, OperatingCostsBreakdown } from './types';

/**
 * Calculate land freight cost.
 * fleteTerrestre = costoPorCarro * numeroCarros
 *
 * @param costoPorCarro - Cost per truck in COP
 * @param numeroCarros - Number of trucks
 * @returns Land freight cost in COP
 */
export function calculateLandFreight(costoPorCarro: number, numeroCarros: number): number {
  return costoPorCarro * numeroCarros;
}

/**
 * Calculate maquila cost.
 * maquila = maquilaPorKg * kilosExportables
 *
 * @param maquilaPorKg - Maquila cost per kg in COP
 * @param kilosExportables - Kilos eligible for export
 * @returns Maquila cost in COP
 */
export function calculateMaquila(maquilaPorKg: number, kilosExportables: number): number {
  return maquilaPorKg * kilosExportables;
}

/**
 * Calculate packaging material cost.
 * materialEmpaque = empaquePorCaja * totalCajas
 *
 * @param empaquePorCaja - Packaging cost per box in COP
 * @param totalCajas - Total boxes
 * @returns Packaging material cost in COP
 */
export function calculatePackagingMaterial(empaquePorCaja: number, totalCajas: number): number {
  return empaquePorCaja * totalCajas;
}

/**
 * Calculate administrative cost.
 * costoAdministrativo = (costoAdminPorKg1 * kilos) + (costoAdminPorKg2 * kilos)
 *
 * The Excel uses: (100 * kilos) + (50 * kilos)
 * These are kept as two separate parameters.
 *
 * @param costoAdminPorKg1 - First admin cost per kg in COP
 * @param costoAdminPorKg2 - Second admin cost per kg in COP
 * @param kilos - Total kilos
 * @returns Administrative cost in COP
 */
export function calculateAdministrativeCost(
  costoAdminPorKg1: number,
  costoAdminPorKg2: number,
  kilos: number
): number {
  return costoAdminPorKg1 * kilos + costoAdminPorKg2 * kilos;
}

/**
 * Calculate all operating costs breakdown.
 *
 * Each component is calculated independently:
 * - fleteTerrestre = costoPorCarro * numeroCarros
 * - maquila = maquilaPorKg * kilosExportables
 * - transportePuerto (fixed value from input)
 * - gastosPuerto (fixed value from input)
 * - materialEmpaque = empaquePorCaja * totalCajas
 * - costoAdministrativo = (costoAdminPorKg1 + costoAdminPorKg2) * kilos
 * - analisisResidualidad (fixed)
 * - survey (fixed)
 * - intermediacionFinanciera (fixed)
 * - seguroFactura (fixed)
 * - gastosBancarios (fixed)
 * - arancel (fixed)
 *
 * @param input - Operating costs configuration
 * @param totalKilos - Total kilos (for per-kg calculations)
 * @param totalCajas - Total boxes (for packaging calculation)
 * @returns Breakdown of each operating cost component in COP
 */
export function calculateOperatingCostsBreakdown(
  input: OperatingCostsInput,
  totalKilos: number,
  totalCajas: number
): OperatingCostsBreakdown {
  const fleteTerrestre = calculateLandFreight(input.fleteTerrestrePorCarro, input.numeroCarros);
  const maquila = calculateMaquila(input.maquilaPorKg, input.kilosExportables);
  const materialEmpaque = calculatePackagingMaterial(input.empaquePorCaja, totalCajas);
  const costoAdministrativo = calculateAdministrativeCost(
    input.costoAdminPorKg1,
    input.costoAdminPorKg2,
    totalKilos
  );

  return {
    fleteTerrestre,
    maquila,
    transportePuerto: input.transportePuerto,
    gastosPuerto: input.gastosPuerto,
    materialEmpaque,
    costoAdministrativo,
    analisisResidualidad: input.analisisResidualidad,
    survey: input.survey,
    intermediacionFinanciera: input.intermediacionFinanciera,
    seguroFactura: input.seguroFactura,
    gastosBancarios: input.gastosBancarios,
    arancel: input.arancel,
  };
}

/**
 * Calculate the base operating costs (sum of all components, before contingency).
 *
 * This corresponds to Excel E26 = SUM(E13:E24)
 *
 * @param breakdown - Operating costs breakdown
 * @returns Sum of all operating cost components in COP
 */
export function calculateOperatingCostsBase(breakdown: OperatingCostsBreakdown): number {
  return (
    breakdown.fleteTerrestre +
    breakdown.maquila +
    breakdown.transportePuerto +
    breakdown.gastosPuerto +
    breakdown.materialEmpaque +
    breakdown.costoAdministrativo +
    breakdown.analisisResidualidad +
    breakdown.survey +
    breakdown.intermediacionFinanciera +
    breakdown.seguroFactura +
    breakdown.gastosBancarios +
    breakdown.arancel
  );
}

/**
 * Calculate contingency (imprevistos).
 *
 * imprevistos = subtotalCostos * porcentajeImprevistos
 *
 * This corresponds to Excel E27 = E26 * porcentajeImprevistos
 * Currently: porcentajeImprevistos = 5%
 *
 * @param operatingCostsBase - Base operating costs sum
 * @param porcentajeImprevistos - Contingency percentage (e.g. 0.05 for 5%)
 * @returns Contingency amount in COP
 */
export function calculateContingency(
  operatingCostsBase: number,
  porcentajeImprevistos: number
): number {
  return operatingCostsBase * porcentajeImprevistos;
}

/**
 * Calculate total operating costs including contingency.
 *
 * totalOperatingCosts = operatingCostsBase + contingency
 *
 * @param operatingCostsBase - Base operating costs
 * @param contingency - Contingency amount
 * @returns Total operating costs in COP
 */
export function calculateTotalOperatingCosts(
  operatingCostsBase: number,
  contingency: number
): number {
  return operatingCostsBase + contingency;
}
