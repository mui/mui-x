// Per-table column-type metadata for the Data Studio "golden" demo SQLite
// fixtures. Shared by the CSV generators and the in-place migration so that
// the two stay in lockstep.
//
// Each column entry is `{ type, parser? }`:
//   - `type`    — SQLite affinity used in `CREATE TABLE` (`REAL` / `INTEGER` /
//                 `TEXT`). Anything not listed defaults to `TEXT`.
//   - `parser`  — how to coerce a raw CSV / legacy-TEXT value before inserting
//                 it into the new column. Omitted = pass the string through.
//
// Keep this map as the single source of truth; do not duplicate type lists in
// the generator scripts or the migration.

export const SCHEMA = {
  'coffee-beans': {
    products: {
      'Unit Price': { type: 'REAL', parser: 'number' },
      'Price per 100g': { type: 'REAL', parser: 'number' },
      Profit: { type: 'REAL', parser: 'number' },
    },
    orders: {
      Quantity: { type: 'INTEGER', parser: 'integer' },
      'Unit Price': { type: 'REAL', parser: 'number' },
      Sales: { type: 'REAL', parser: 'number' },
    },
  },
  'adventure-works': {
    product: {
      standard_cost: { type: 'REAL', parser: 'currency' },
      list_price: { type: 'REAL', parser: 'currency' },
    },
    sales: {
      order_quantity: { type: 'INTEGER', parser: 'integer' },
      unit_price: { type: 'REAL', parser: 'currency' },
      extended_amount: { type: 'REAL', parser: 'currency' },
      product_standard_cost: { type: 'REAL', parser: 'currency' },
      total_product_cost: { type: 'REAL', parser: 'currency' },
      sales_amount: { type: 'REAL', parser: 'currency' },
      unit_price_discount_pct: { type: 'REAL', parser: 'percent' },
    },
  },
};

export function getColumnType(dataSource, table, column) {
  return SCHEMA[dataSource]?.[table]?.[column]?.type ?? 'TEXT';
}

export function getColumnParser(dataSource, table, column) {
  return SCHEMA[dataSource]?.[table]?.[column]?.parser;
}

function isBlank(value) {
  return value == null || (typeof value === 'string' && value.trim() === '');
}

export function parseNumber(value) {
  if (isBlank(value)) {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const num = Number(String(value).trim());
  return Number.isFinite(num) ? num : null;
}

export function parseInteger(value) {
  const num = parseNumber(value);
  return num == null ? null : Math.trunc(num);
}

// Strips currency symbols, thousands separators, and surrounding whitespace.
// Keeps digits, the decimal point, and a leading sign.
export function parseCurrency(value) {
  if (isBlank(value)) {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const cleaned = String(value)
    .replace(/[^\d.-]/g, '')
    .replace(/(?!^)-/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') {
    return null;
  }
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

// "0.00%" -> 0; "12.34 %" -> 0.1234. Returns the fractional ratio (0–1 for
// well-formed inputs), matching the convention the Data Grid number column /
// percent formatter expects.
export function parsePercent(value) {
  if (isBlank(value)) {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value / 100 : null;
  }
  const cleaned = String(value)
    .replace(/[^\d.-]/g, '')
    .replace(/(?!^)-/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') {
    return null;
  }
  const num = Number(cleaned);
  return Number.isFinite(num) ? num / 100 : null;
}

export function parseValue(parser, raw) {
  switch (parser) {
    case 'integer':
      return parseInteger(raw);
    case 'number':
      return parseNumber(raw);
    case 'currency':
      return parseCurrency(raw);
    case 'percent':
      return parsePercent(raw);
    default:
      return raw;
  }
}
