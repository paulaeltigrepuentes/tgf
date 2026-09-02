// ============================================================================
// Domain Types - Colombian Commodities Trading Platform
// ============================================================================

// --- Enums (as const objects for type safety) ---

export const QuoteStatus = {
  DRAFT: 'borrador',
  PENDING_APPROVAL: 'pendiente_aprobacion',
  APPROVED: 'aprobada',
  REJECTED: 'rechazada',
  SENT_TO_CLIENT: 'enviada_cliente',
  CLIENT_ACCEPTED: 'aceptada_cliente',
  CANCELLED: 'cancelada',
  OLD_VERSION: 'version_anterior',
} as const;
export type QuoteStatus = typeof QuoteStatus[keyof typeof QuoteStatus];

export const Incoterm = {
  FOB: 'FOB',
  CIF: 'CIF',
} as const;
export type Incoterm = typeof Incoterm[keyof typeof Incoterm];

export const Currency = {
  USD: 'USD',
  EUR: 'EUR',
  COP: 'COP',
} as const;
export type Currency = typeof Currency[keyof typeof Currency];

export const ApprovalStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;
export type ApprovalStatus = typeof ApprovalStatus[keyof typeof ApprovalStatus];

export const RoleName = {
  GERENCIAL: 'gerencial',
  PRICING: 'pricing',
  COMERCIAL: 'comercial',
} as const;
export type RoleName = typeof RoleName[keyof typeof RoleName];

export const CalcType = {
  FIXED_COP: 'fixed_cop',
  PER_KG_COP: 'per_kg_cop',
  PERCENTAGE: 'percentage',
} as const;
export type CalcType = typeof CalcType[keyof typeof CalcType];

export const CustomerStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;
export type CustomerStatus = typeof CustomerStatus[keyof typeof CustomerStatus];

// --- Core Entities ---

export interface User {
  id: string;
  full_name: string;
  email: string;
  role_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserWithRole extends User {
  role?: Role;
}

export interface Role {
  id: string;
  name: RoleName;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  hs_code: string | null;
  active: boolean;
  created_at: string;
}

export interface Caliber {
  id: string;
  product_id: string;
  caliber_code: number;
  gramage_range: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface CaliberWithPrice extends Caliber {
  caliber_prices?: CaliberPrice[];
  latest_price?: CaliberPrice;
}

export interface CaliberPrice {
  id: string;
  caliber_id: string;
  purchase_price_cop: number;
  effective_from: string;
  created_by: string | null;
  created_at: string;
}

export interface PackagingType {
  id: string;
  name: string;
  kg_per_box: number;
  packaging_cost_cop: number;
  active: boolean;
  created_at: string;
}

export interface ExchangeRate {
  id: string;
  currency_pair: 'USD/COP' | 'EUR/COP' | 'EUR/USD';
  manual_rate: number;
  spread: number;
  market_reference_rate: number | null;
  effective_from: string;
  created_by: string | null;
  created_at: string;
}

export interface FreightRate {
  id: string;
  route_label: string;
  value_usd_per_container: number;
  effective_from: string;
  created_by: string | null;
  created_at: string;
}

export interface InsuranceRate {
  id: string;
  value_usd_per_container: number;
  effective_from: string;
  created_by: string | null;
  created_at: string;
}

export interface PricingParameter {
  id: string;
  key: string;
  name: string;
  calc_type: CalcType;
  value: number;
  unit: string | null;
  description: string | null;
  active: boolean;
  updated_by: string | null;
  updated_at: string;
}

export interface Customer {
  id: string;
  company_name: string;
  contact_name: string | null;
  vat_id: string | null;
  address: string | null;
  country: string | null;
  city: string | null;
  email: string | null;
  phone: string | null;
  payment_terms: string | null;
  default_incoterm: Incoterm;
  default_currency: Currency;
  status: CustomerStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  version_number: number;
  parent_quote_id: string | null;
  customer_id: string | null;
  product_id: string | null;
  num_containers: number;
  packaging_type_id: string | null;
  incoterm: Incoterm;
  currency: Currency;
  origin: string | null;
  destination_country: string | null;
  port_loading: string | null;
  port_discharge: string | null;
  vessel_booking: string | null;
  payment_terms: string | null;
  exchange_rate_id_used: string | null;
  freight_rate_id_used: string | null;
  insurance_rate_id_used: string | null;
  target_margin_pct_general: number;
  investor_partner: boolean;
  investor_share_pct: number;
  cost_total: number | null;
  sale_total: number | null;
  profit_total: number | null;
  weighted_margin_pct: number | null;
  status: QuoteStatus;
  commercial_user_id: string | null;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteWithRelations extends Quote {
  customer?: Customer;
  product?: Product;
  packaging_type?: PackagingType;
  exchange_rate?: ExchangeRate;
  freight_rate?: FreightRate;
  insurance_rate?: InsuranceRate;
  commercial_user?: User;
  quote_items?: QuoteItem[];
  containers?: Container[];
  approvals?: Approval[];
  national_sales?: NationalSale[];
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  caliber_id: string;
  boxes: number;
  kg_per_box: number;
  total_kg: number;
  purchase_price_cop: number;
  margin_pct: number;
  margin_is_override: boolean;
  unit_cost_fob: number;
  unit_cost_cif: number;
  unit_price_fob: number;
  unit_price_cif: number;
  subtotal_fob: number;
  subtotal_cif: number;
  created_at: string;
}

export interface QuoteItemWithCaliber extends QuoteItem {
  caliber?: Caliber;
}

export interface Container {
  id: string;
  quote_id: string;
  container_number: string | null;
  total_boxes: number | null;
  total_kg: number | null;
  net_weight: number | null;
  gross_weight: number | null;
  pallets: number | null;
  created_at: string;
}

export interface Approval {
  id: string;
  quote_id: string;
  requested_by: string | null;
  requested_at: string;
  status: ApprovalStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  comment: string | null;
  created_at: string;
}

export interface ApprovalWithUser extends Approval {
  requester?: User;
  reviewer?: User;
}

export interface NationalSale {
  id: string;
  quote_id: string;
  caliber_id: string;
  kg_sold: number | null;
  negotiated_price_cop: number | null;
  revenue_cop: number | null;
  created_by: string | null;
  created_at: string;
}

export interface NationalSaleWithCaliber extends NationalSale {
  caliber?: Caliber;
}

export interface QuoteVersion {
  id: number;
  quote_id: number | null;
  version_number: number;
  snapshot: Record<string, unknown> | null;
  created_by: string | null;
  created_at: string;
}

export interface PdfDocument {
  id: string;
  quote_id: string;
  version_number: number | null;
  file_url: string | null;
  generated_by: string | null;
  generated_at: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}

export interface GeneralSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_by: string | null;
  updated_at: string;
}

// --- UI/Form Types ---

export interface QuoteFormData {
  customer_id: string;
  product_id: string;
  num_containers: number;
  packaging_type_id: string;
  incoterm: Incoterm;
  currency: Currency;
  origin: string;
  destination_country: string;
  port_loading: string;
  port_discharge: string;
  payment_terms: string;
  target_margin_pct_general: number;
  investor_partner: boolean;
  investor_share_pct: number;
  quote_items: QuoteItemFormData[];
  comment?: string;
}

export interface QuoteItemFormData {
  caliber_id: string;
  boxes: number;
  margin_pct: number;
  margin_is_override: boolean;
}

export interface CustomerFormData {
  company_name: string;
  contact_name?: string;
  vat_id?: string;
  address?: string;
  country?: string;
  city?: string;
  email?: string;
  phone?: string;
  payment_terms?: string;
  default_incoterm: Incoterm;
  default_currency: Currency;
}

export interface PricingParameterFormData {
  key: string;
  name: string;
  calc_type: CalcType;
  value: number;
  unit?: string;
  description?: string;
}

export interface ExchangeRateFormData {
  currency_pair: 'USD/COP' | 'EUR/COP' | 'EUR/USD';
  manual_rate: number;
  spread?: number;
  market_reference_rate?: number;
}

export interface FreightRateFormData {
  route_label: string;
  value_usd_per_container: number;
}

export interface InsuranceRateFormData {
  value_usd_per_container: number;
}

export interface CaliberPriceFormData {
  caliber_id: string;
  purchase_price_cop: number;
}
