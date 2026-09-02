// ============================================================================
// Type Definitions - ColCom Trade Calculation Engine
// ============================================================================

export type Currency = 'USD' | 'EUR' | 'COP';

export type Incoterm = 'FOB' | 'CIF';

export type PackagingType = '4kg' | '10kg' | '11.3kg';

// --- Caliber reference data (from Excel) ---

export interface CaliberReference {
  /** Commercial caliber code, e.g. 12, 14, 16... 32 */
  caliber: number;
  /** Grammage range string, e.g. "302-366" */
  gramajeRange: string;
  /** Minimum grammage for this caliber */
  gramajeMin: number;
  /** Maximum grammage for this caliber */
  gramajeMax: number;
}

/**
 * Caliber table from the Excel (FRUTA sheet).
 * Caliber number is NOT the same as grams per fruit.
 */
export const CALIBER_TABLE: CaliberReference[] = [
  { caliber: 12, gramajeRange: '302-366', gramajeMin: 302, gramajeMax: 366 },
  { caliber: 14, gramajeRange: '259-301', gramajeMin: 259, gramajeMax: 301 },
  { caliber: 16, gramajeRange: '229-258', gramajeMin: 229, gramajeMax: 258 },
  { caliber: 18, gramajeRange: '205-228', gramajeMin: 205, gramajeMax: 228 },
  { caliber: 20, gramajeRange: '186-204', gramajeMin: 186, gramajeMax: 204 },
  { caliber: 22, gramajeRange: '167-185', gramajeMin: 167, gramajeMax: 185 },
  { caliber: 24, gramajeRange: '153-166', gramajeMin: 153, gramajeMax: 166 },
  { caliber: 26, gramajeRange: '146-152', gramajeMin: 146, gramajeMax: 152 },
  { caliber: 28, gramajeRange: '136-145', gramajeMin: 136, gramajeMax: 145 },
  { caliber: 30, gramajeRange: '125-135', gramajeMin: 125, gramajeMax: 135 },
  { caliber: 32, gramajeRange: '105-124', gramajeMin: 105, gramajeMax: 124 },
];

// --- Packaging reference data ---

export interface PackagingReference {
  type: PackagingType;
  kgPerBox: number;
  /** Cost per box in COP */
  costPerBoxCOP: number;
}

/**
 * Packaging costs from Excel (FRUTA sheet).
 * The cost per box depends on the box type.
 */
export const PACKAGING_TABLE: PackagingReference[] = [
  { type: '10kg', kgPerBox: 10, costPerBoxCOP: 2700 },
  { type: '4kg', kgPerBox: 4, costPerBoxCOP: 3300 },
  { type: '11.3kg', kgPerBox: 11.3, costPerBoxCOP: 8200 },
];

// --- Input types ---

export interface CaliberLineInput {
  /** Commercial caliber code (e.g. 22) */
  caliber: number;
  /** Number of boxes for this caliber line */
  boxes: number;
  /** Weight per box in kg (e.g. 10, 4, 11.3) */
  kgPerBox: number;
  /** Purchase price per kg in COP */
  purchasePricePerKgCOP: number;
  /** Margin percentage for this line (e.g. 0.15 for 15%) */
  marginPct: number;
  /** Optional margin override flag */
  marginIsOverride?: boolean;
}

export interface ExchangeRatesInput {
  /** USD to COP rate (TRM USD/COP) */
  usdCop: number;
  /** EUR to COP rate (TRM EUR/COP) */
  eurCop: number;
}

export interface OperatingCostsInput {
  // --- Per-unit costs ---
  /** Cost per truck for land freight in COP */
  fleteTerrestrePorCarro: number;
  /** Number of trucks */
  numeroCarros: number;
  /** Maquila cost per kg in COP */
  maquilaPorKg: number;
  /** Kilos eligible for export (for maquila calculation) */
  kilosExportables: number;
  /** Transport to port in COP (fixed or per unit) */
  transportePuerto: number;
  /** Port expenses in COP */
  gastosPuerto: number;
  /** Packaging cost per box in COP (determined by box type) */
  empaquePorCaja: number;
  /** Admin cost per kg component 1 in COP (Excel: 100 * kilos) */
  costoAdminPorKg1: number;
  /** Admin cost per kg component 2 in COP (Excel: 50 * kilos) */
  costoAdminPorKg2: number;

  // --- Fixed costs ---
  /** Residuality analysis cost in COP */
  analisisResidualidad: number;
  /** Survey cost in COP */
  survey: number;
  /** Financial intermediation cost in COP */
  intermediacionFinanciera: number;
  /** Bank expenses in COP */
  gastosBancarios: number;
  /** Tariff / arancel in COP */
  arancel: number;
  /** Invoice insurance cost in COP */
  seguroFactura: number;

  // --- Contingency ---
  /** Contingency percentage (e.g. 0.05 for 5%) */
  porcentajeImprevistos: number;
}

export interface FreightInput {
  /** Freight per container in USD */
  fletePorContenedor: number;
  /** Number of containers */
  numeroContenedores: number;
}

export interface InsuranceInput {
  /** Maritime insurance value (in its original currency) */
  valor: number;
  /** Currency of the insurance value */
  currency: Currency;
}

export interface NationalSaleInput {
  /** Discount percentage on average purchase price (e.g. 0.10 for 10%) */
  porcentajeDescuento: number;
  /** Markup percentage on national purchase price (e.g. 0.10 for 10%) */
  porcentajeVenta: number;
  /** Kilos sold nationally */
  kilosVendidos: number;
}

export interface QuoteInput {
  /** Caliber lines (each line = one caliber with boxes, price, margin) */
  lines: CaliberLineInput[];
  /** Exchange rates */
  rates: ExchangeRatesInput;
  /** Operating costs configuration */
  operatingCosts: OperatingCostsInput;
  /** Freight configuration */
  freight: FreightInput;
  /** Insurance configuration */
  insurance: InsuranceInput;
  /** National sale configuration */
  nationalSale: NationalSaleInput;
  /** Incoterm for this quote */
  incoterm: Incoterm;
  /** Total boxes across all lines (for packaging cost) */
  totalCajas: number;
  /** Total kilos across all lines (for per-kg calculations) */
  totalKilos: number;
}

// --- Output types ---

export interface CaliberLineResult {
  caliber: number;
  boxes: number;
  kgPerBox: number;
  kilos: number;
  purchasePricePerKgCOP: number;
  marginPct: number;

  // Costs per kg in COP
  fobCostPerKgCOP: number;
  cifCostPerKgCOP: number;

  // Costs per kg in EUR
  fobCostPerKgEUR: number;
  cifCostPerKgEUR: number;

  // Sale prices per kg in EUR (depending on incoterm)
  fobSalePricePerKgEUR: number;
  cifSalePricePerKgEUR: number;

  // Sale prices per box in EUR
  fobSalePricePerBoxEUR: number;
  cifSalePricePerBoxEUR: number;

  // Subtotals per line
  fobSubtotalEUR: number;
  cifSubtotalEUR: number;

  // Profit per line in EUR
  fobProfitEUR: number;
  cifProfitEUR: number;
}

export interface QuoteResult {
  // Quantities
  kilos: number;
  boxes: number;

  // Fruit costs
  fruitCost: number;
  averagePurchasePrice: number;

  // Operating costs breakdown
  operatingCosts: OperatingCostsBreakdown;
  operatingCostsBase: number;
  contingency: number;

  // FOB
  fobCost: number;
  fobCostPerKg: number;

  // Freight & Insurance
  freight: number;
  insurance: number;

  // CIF
  cifCost: number;
  cifCostPerKg: number;

  // Sales
  fobSale: number;
  cifSale: number;

  // Profit
  profit: number;
  consolidatedMargin: number;

  // Per-line detail
  lines: CaliberLineResult[];

  // National sale
  nationalSale: NationalSaleResult;
}

export interface OperatingCostsBreakdown {
  fleteTerrestre: number;
  maquila: number;
  transportePuerto: number;
  gastosPuerto: number;
  materialEmpaque: number;
  costoAdministrativo: number;
  analisisResidualidad: number;
  survey: number;
  intermediacionFinanciera: number;
  seguroFactura: number;
  gastosBancarios: number;
  arancel: number;
}

export interface NationalSaleResult {
  averagePurchasePrice: number;
  precioCompraNacional: number;
  precioVentaNacional: number;
  totalVentaNacional: number;
  totalCompraNacional: number;
  utilidadNacional: number;
}
