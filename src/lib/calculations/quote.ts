// ============================================================================
// Quote Totals Orchestration - ColCom Trade Calculation Engine
// ============================================================================

import type {
  QuoteInput,
  QuoteResult,
  CaliberLineResult,
  Incoterm,
} from './types';
import { calculateTotalKilos, calculateTotalBoxes } from './quantities';
import { calculateTotalFruitCost, calculateAveragePurchasePrice } from './fruit';
import {
  calculateOperatingCostsBreakdown,
  calculateOperatingCostsBase,
  calculateContingency,
} from './operating-costs';
import { calculateFOBCost, calculateFOBCostPerKg, calculateOperatingCostFOBPerKg } from './fob';
import {
  calculateFreight,
  calculateInsuranceInCOP,
  calculateCIFCost,
  calculateCIFCostPerKg,
} from './cif';
import { calculateConsolidatedMargin } from './profit';
import { calculateNationalSale } from './national-sale';
import { usdToCop, copToEur } from './currency';

/**
 * Calculate per-line results for all caliber lines.
 *
 * For each line, calculates:
 * - FOB cost per kg (COP and EUR)
 * - CIF cost per kg (COP and EUR)
 * - FOB and CIF sale prices per kg and per box (EUR)
 * - Subtotals and profit per line
 *
 * @param input - Quote input
 * @param operatingCostFOBPerKg - Operating cost FOB per kg in COP
 * @param freightPerKgCOP - Freight per kg in COP
 * @param insurancePerKgCOP - Insurance per kg in COP
 * @returns Array of per-line results
 */
function calculateLineResults(
  input: QuoteInput,
  operatingCostFOBPerKg: number,
  freightPerKgCOP: number,
  insurancePerKgCOP: number
): CaliberLineResult[] {
  return input.lines.map((line) => {
    const kilos = line.boxes * line.kgPerBox;

    // --- FOB cost per kg ---
    const fobCostPerKgCOP = line.purchasePricePerKgCOP + operatingCostFOBPerKg;
    const fobCostPerKgEUR = copToEur(fobCostPerKgCOP, input.rates);

    // --- CIF cost per kg ---
    const cifCostPerKgCOP =
      line.purchasePricePerKgCOP + operatingCostFOBPerKg + freightPerKgCOP + insurancePerKgCOP;
    const cifCostPerKgEUR = copToEur(cifCostPerKgCOP, input.rates);

    // --- FOB sale prices (EUR) ---
    const fobSalePricePerKgEUR = fobCostPerKgEUR / (1 - line.marginPct);
    const fobSalePricePerBoxEUR = fobSalePricePerKgEUR * line.kgPerBox;
    const fobSubtotalEUR = fobSalePricePerBoxEUR * line.boxes;
    const fobProfitEUR = fobSubtotalEUR - (fobCostPerKgEUR * kilos);

    // --- CIF sale prices (EUR) ---
    const cifSalePricePerKgEUR = cifCostPerKgEUR / (1 - line.marginPct);
    const cifSalePricePerBoxEUR = cifSalePricePerKgEUR * line.kgPerBox;
    const cifSubtotalEUR = cifSalePricePerBoxEUR * line.boxes;
    const cifProfitEUR = cifSubtotalEUR - (cifCostPerKgEUR * kilos);

    return {
      caliber: line.caliber,
      boxes: line.boxes,
      kgPerBox: line.kgPerBox,
      kilos,
      purchasePricePerKgCOP: line.purchasePricePerKgCOP,
      marginPct: line.marginPct,
      fobCostPerKgCOP,
      cifCostPerKgCOP,
      fobCostPerKgEUR,
      cifCostPerKgEUR,
      fobSalePricePerKgEUR,
      cifSalePricePerKgEUR,
      fobSalePricePerBoxEUR,
      cifSalePricePerBoxEUR,
      fobSubtotalEUR,
      cifSubtotalEUR,
      fobProfitEUR,
      cifProfitEUR,
    };
  });
}

/**
 * Calculate complete quote totals.
 *
 * This is the main orchestration function that ties together all calculation
 * components in the correct order:
 *
 * 1. Quantities (kilos, boxes)
 * 2. Fruit cost
 * 3. Average purchase price
 * 4. Operating costs breakdown
 * 5. Contingency
 * 6. FOB cost (operating costs base + contingency + fruit cost)
 * 7. Freight & insurance (converted to COP)
 * 8. CIF cost (FOB + freight + insurance)
 * 9. Per-line sale prices and profits
 * 10. Totals (sale, cost, profit)
 * 11. Consolidated margin (on totals, not average of per-line)
 * 12. National sale
 *
 * @param input - Complete quote input
 * @returns Complete quote result with all calculations
 */
export function calculateQuoteTotals(input: QuoteInput): QuoteResult {
  // --- 1. Quantities ---
  const kilos = calculateTotalKilos(input.lines);
  const boxes = calculateTotalBoxes(input.lines);

  // --- 2. Fruit cost ---
  const fruitCost = calculateTotalFruitCost(input.lines);

  // --- 3. Average purchase price ---
  const averagePurchasePrice = calculateAveragePurchasePrice(input.lines);

  // --- 4. Operating costs breakdown ---
  const operatingCosts = calculateOperatingCostsBreakdown(
    input.operatingCosts,
    kilos,
    boxes
  );

  // --- 5. Base + contingency ---
  const operatingCostsBase = calculateOperatingCostsBase(operatingCosts);
  const contingency = calculateContingency(
    operatingCostsBase,
    input.operatingCosts.porcentajeImprevistos
  );

  // --- 6. FOB cost ---
  const fobCost = calculateFOBCost(operatingCostsBase, contingency, fruitCost);
  const fobCostPerKg = calculateFOBCostPerKg(fobCost, kilos);

  // --- 7. Freight & Insurance ---
  const freightUSD = calculateFreight(input.freight);
  const freightCOP = usdToCop(freightUSD, input.rates);
  const insuranceCOP = calculateInsuranceInCOP(input.insurance, input.rates);

  // --- 8. CIF cost ---
  const cifCost = calculateCIFCost(fobCost, freightCOP, insuranceCOP);
  const cifCostPerKg = calculateCIFCostPerKg(cifCost, kilos);

  // --- 9. Per-line results ---
  const operatingCostFOBPerKg = calculateOperatingCostFOBPerKg(
    operatingCostsBase,
    contingency,
    kilos
  );
  const freightPerKgCOP = kilos > 0 ? freightCOP / kilos : 0;
  const insurancePerKgCOP = kilos > 0 ? insuranceCOP / kilos : 0;

  const lineResults = calculateLineResults(
    input,
    operatingCostFOBPerKg,
    freightPerKgCOP,
    insurancePerKgCOP
  );

  // --- 10. Totals ---
  // Use the appropriate sale/profit based on incoterm
  const fobSale = lineResults.reduce((sum, l) => sum + l.fobSubtotalEUR, 0);
  const cifSale = lineResults.reduce((sum, l) => sum + l.cifSubtotalEUR, 0);

  const fobTotalCostEUR = lineResults.reduce(
    (sum, l) => sum + l.fobCostPerKgEUR * l.kilos,
    0
  );
  const cifTotalCostEUR = lineResults.reduce(
    (sum, l) => sum + l.cifCostPerKgEUR * l.kilos,
    0
  );

  const fobProfit = lineResults.reduce((sum, l) => sum + l.fobProfitEUR, 0);
  const cifProfit = lineResults.reduce((sum, l) => sum + l.cifProfitEUR, 0);

  // --- 11. Consolidated margin (on totals) ---
  const sale = input.incoterm === 'CIF' ? cifSale : fobSale;
  const cost = input.incoterm === 'CIF' ? cifTotalCostEUR : fobTotalCostEUR;
  const profit = input.incoterm === 'CIF' ? cifProfit : fobProfit;
  const consolidatedMargin = calculateConsolidatedMargin(sale, cost);

  // --- 12. National sale ---
  const nationalSale = calculateNationalSale(input.lines, input.nationalSale);

  return {
    kilos,
    boxes,
    fruitCost,
    averagePurchasePrice,
    operatingCosts,
    operatingCostsBase,
    contingency,
    fobCost,
    fobCostPerKg,
    freight: freightUSD,
    insurance: input.insurance.valor,
    cifCost,
    cifCostPerKg,
    fobSale,
    cifSale,
    profit,
    consolidatedMargin,
    lines: lineResults,
    nationalSale,
  };
}
