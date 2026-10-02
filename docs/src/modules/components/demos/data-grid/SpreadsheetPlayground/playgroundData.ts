import { gridStringOrNumberComparator } from '@mui/x-data-grid-premium';
import type { GridCellParams, GridColDef, GridRowModel } from '@mui/x-data-grid-premium';

export type TemplateId = 'commission' | 'budget' | 'gradebook';

export interface PlaygroundTemplate {
  id: TemplateId;
  /** Label shown in the template switcher. */
  label: string;
  /** Name shown on the sheet tab in the footer. */
  sheetName: string;
  columns: GridColDef[];
  rows: GridRowModel[];
  pinnedTop: GridRowModel[];
  pinnedBottom: GridRowModel[];
  /** Autocomplete hint surfaced when custom functions are enabled. */
  customFunctionHint: string;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const currencyCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

// The pinned-top row holds the sheet's constants (view row 1), so data rows
// start at view row 2 and the constants read as `$B$1`-style absolute
// references in A1 notation.
const CONFIG_ROW_ID = 'config';

// Blank rows appended after the data, so the sheet shows Sheets-like empty
// gridlined rows ready to type into. Aggregates skip blanks, so the pinned
// totals are unaffected.
function makeEmptyRows(idPrefix: string, count: number): GridRowModel[] {
  return Array.from({ length: count }, (unused, index) => ({
    id: `${idPrefix}-blank-${index + 1}`,
  }));
}

// Like a spreadsheet, blank cells sink to the bottom for BOTH sort directions
// (the grid's default comparator would float them to the top on descending).
export const sortBlanksLast: NonNullable<GridColDef['getSortComparator']> = (sortDirection) => {
  const modifier = sortDirection === 'desc' ? -1 : 1;
  return (value1, value2, cellParams1, cellParams2) => {
    const blank1 = value1 === null || value1 === undefined || value1 === '';
    const blank2 = value2 === null || value2 === undefined || value2 === '';
    if (blank1 && blank2) {
      return 0;
    }
    if (blank1) {
      return 1;
    }
    if (blank2) {
      return -1;
    }
    return modifier * gridStringOrNumberComparator(value1, value2, cellParams1, cellParams2);
  };
};

// Clipboard paste and fill-handle drags re-enter the grid carrying each source
// cell's FORMATTED text (e.g. "$137,500", "8%", or "137,500" from the default
// number formatter), which the number column's stock parser turns into NaN.
// Recover the numeric value instead, and never write NaN into the sheet.
const parsePastedNumber: NonNullable<GridColDef['pastedValueParser']> = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const raw = String(value).trim();
  if (raw === '') {
    return null;
  }
  if (raw.startsWith('=') || raw.startsWith("'=")) {
    // Formula sources (and escaped literals) flow through to the formula
    // feature's wrapped `valueSetter` untouched.
    return value;
  }
  const isPercent = raw.endsWith('%');
  const parsed = Number(raw.replace(/[$,%\s]/g, ''));
  if (Number.isNaN(parsed)) {
    // Unparseable text: skip the update, leaving the target cell unchanged.
    return undefined;
  }
  return isPercent ? parsed / 100 : parsed;
};

/**
 * Shared per-column behavior for template and user-added columns alike:
 * blanks sink on sort, and pasted/filled number text is parsed back from its
 * formatted form.
 */
export function withPlaygroundColumnBehavior(column: GridColDef): GridColDef {
  return {
    ...column,
    getSortComparator: sortBlanksLast,
    ...(column.type === 'number' ? { pastedValueParser: parsePastedNumber } : null),
  };
}

function withSortBlanksLast(columns: GridColDef[]): GridColDef[] {
  return columns.map(withPlaygroundColumnBehavior);
}

function formatCurrency(value: unknown) {
  return typeof value === 'number' ? currency.format(value) : (value as string);
}

function formatCurrencyCents(value: unknown) {
  return typeof value === 'number' ? currencyCents.format(value) : (value as string);
}

function formatPercent(value: unknown) {
  return typeof value === 'number' ? percent.format(value) : (value as string);
}

/** Currency for data rows, percent for the pinned constants row. */
function formatCurrencyOrRate(value: unknown, row: GridRowModel) {
  if (row.id === CONFIG_ROW_ID) {
    return formatPercent(value);
  }
  return formatCurrency(value);
}

function formatScoreOrWeight(value: unknown, row: GridRowModel) {
  if (row.id === CONFIG_ROW_ID) {
    return formatPercent(value);
  }
  return typeof value === 'number' ? String(Math.round(value * 10) / 10) : (value as string);
}

// Sheets-style conditional formatting: `cellClassName` receives the EVALUATED
// value of a formula cell, so the colors follow the recalculated results.
function statusClassName(params: GridCellParams) {
  if (params.value === 'Over') {
    return 'sheets-cond--bad';
  }
  return params.value === 'OK' ? 'sheets-cond--good' : '';
}

function gradeClassName(params: GridCellParams) {
  if (params.value === 'A' || params.value === 'B') {
    return 'sheets-cond--good';
  }
  if (params.value === 'C') {
    return 'sheets-cond--warn';
  }
  return params.value === 'D' || params.value === 'F' ? 'sheets-cond--bad' : '';
}

function bonusClassName(params: GridCellParams) {
  // The pinned totals row aggregates every bonus — don't light it up.
  if (params.id === 'totals') {
    return '';
  }
  return typeof params.value === 'number' && params.value > 0 ? 'sheets-cond--good' : '';
}

// --- Commission tracker ------------------------------------------------------
// Columns: A rep, B region, C revenue, D quota, E commission, F bonus,
// G payout, H cumulative. The commission rate lives in the pinned-top row at
// view position (3, 1) — `$C$1` in A1 notation.

const COMMISSION_RATE_REF = 'REF(COLUMN_POSITION(3), ROW_POSITION(1))';

const commissionFormulas = {
  commission: `=revenue * ${COMMISSION_RATE_REF}`,
  bonus: '=IF(revenue > quota, (revenue - quota) * 0.02, 0)',
  payout: '=commission + bonus',
  // A1 form: `=SUM($G$2:G2)` — the classic running total. The anchored end
  // re-anchors to each row, so the same source text works in every row.
  cumulative:
    '=SUM(RANGE_REF(FIXED(COLUMN_FROM(7)), FIXED(ROW_FROM(2)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(0))))',
};

const commissionReps: Array<[string, string, number, number]> = [
  ['Ava Chen', 'West', 128000, 110000],
  ['Noah Patel', 'East', 94000, 100000],
  ['Amara Osei', 'EMEA', 143000, 120000],
  ['Liam Byrne', 'West', 76000, 90000],
  ['Sofia Marino', 'South', 112000, 100000],
  ['Jonas Weber', 'EMEA', 88500, 95000],
  ['Mei Lin', 'APAC', 150000, 125000],
  ['Diego Ramos', 'South', 67000, 80000],
  ['Zara Ahmed', 'East', 121000, 115000],
  ['Tomas Novak', 'West', 99000, 98000],
  ['Ines Duarte', 'EMEA', 84000, 100000],
  ['Ravi Kumar', 'APAC', 137500, 130000],
];

const commissionTemplate: PlaygroundTemplate = {
  id: 'commission',
  label: 'Commission tracker',
  sheetName: 'Commissions',
  columns: withSortBlanksLast([
    { field: 'rep', headerName: 'Sales rep', width: 150, editable: true, allowFormulas: true },
    { field: 'region', headerName: 'Region', width: 90, editable: true, allowFormulas: true },
    {
      field: 'revenue',
      headerName: 'Revenue',
      type: 'number',
      width: 120,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatCurrencyOrRate,
    },
    {
      field: 'quota',
      headerName: 'Quota',
      type: 'number',
      width: 120,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatCurrency,
    },
    {
      field: 'commission',
      headerName: 'Commission',
      type: 'number',
      width: 125,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatCurrency,
    },
    {
      field: 'bonus',
      headerName: 'Bonus',
      type: 'number',
      width: 110,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatCurrency,
      cellClassName: bonusClassName,
    },
    {
      field: 'payout',
      headerName: 'Payout',
      type: 'number',
      width: 120,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatCurrency,
    },
    {
      field: 'cumulative',
      headerName: 'Cumulative',
      type: 'number',
      width: 135,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatCurrency,
    },
  ]),
  rows: [
    ...commissionReps.map(([rep, region, revenue, quota], index) => ({
      id: `rep-${index + 1}`,
      rep,
      region,
      revenue,
      quota,
      ...commissionFormulas,
    })),
    ...makeEmptyRows('commission', 15),
  ],
  pinnedTop: [{ id: CONFIG_ROW_ID, rep: 'Commission rate', revenue: 0.08 }],
  pinnedBottom: [
    {
      id: 'totals',
      rep: 'Totals',
      revenue: '=SUM(COLUMN_VALUES("revenue"))',
      quota: '=SUM(COLUMN_VALUES("quota"))',
      commission: '=SUM(COLUMN_VALUES("commission"))',
      bonus: '=SUM(COLUMN_VALUES("bonus"))',
      payout: '=SUM(COLUMN_VALUES("payout"))',
    },
  ],
  customFunctionHint: 'Try =TIER(payout, 120000, 90000) in an empty cell',
};

// --- Personal budget ---------------------------------------------------------
// Columns: A category, B budgeted, C actual, D variance, E status, F share,
// G remaining. Monthly income lives in the pinned-top row at (2, 1) — `$B$1`.

const INCOME_REF = 'REF(COLUMN_POSITION(2), ROW_POSITION(1))';

const budgetFormulas = {
  variance: '=budgeted - actual',
  status: '=IF(actual > budgeted, "Over", "OK")',
  share: `=actual / ${INCOME_REF}`,
  // A1 form: `=$B$1 - SUM($C$2:C2)` — income minus everything spent so far.
  remaining: `=${INCOME_REF} - SUM(RANGE_REF(FIXED(COLUMN_FROM(3)), FIXED(ROW_FROM(2)), COLUMN_TO(ANCHOR(-4)), ROW_TO(ANCHOR(0))))`,
};

const budgetCategories: Array<[string, number, number]> = [
  ['Rent', 1400, 1400],
  ['Groceries', 520, 610],
  ['Dining out', 180, 240],
  ['Transport', 160, 145],
  ['Utilities', 220, 205],
  ['Internet & phone', 95, 95],
  ['Subscriptions', 60, 74],
  ['Gym', 45, 45],
  ['Entertainment', 120, 95],
  ['Clothing', 100, 160],
  ['Savings', 800, 800],
  ['Miscellaneous', 150, 210],
];

const budgetTemplate: PlaygroundTemplate = {
  id: 'budget',
  label: 'Personal budget',
  sheetName: 'Budget',
  columns: withSortBlanksLast([
    { field: 'category', headerName: 'Category', width: 160, editable: true, allowFormulas: true },
    {
      field: 'budgeted',
      headerName: 'Budgeted',
      type: 'number',
      width: 120,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatCurrencyCents,
    },
    {
      field: 'actual',
      headerName: 'Actual',
      type: 'number',
      width: 120,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatCurrencyCents,
    },
    {
      field: 'variance',
      headerName: 'Variance',
      type: 'number',
      width: 115,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatCurrencyCents,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 90,
      editable: true,
      allowFormulas: true,
      cellClassName: statusClassName,
    },
    {
      field: 'share',
      headerName: 'Of income',
      type: 'number',
      width: 110,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatPercent,
    },
    {
      field: 'remaining',
      headerName: 'Remaining',
      type: 'number',
      width: 130,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatCurrencyCents,
    },
  ]),
  rows: [
    ...budgetCategories.map(([category, budgeted, actual], index) => ({
      id: `cat-${index + 1}`,
      category,
      budgeted,
      actual,
      ...budgetFormulas,
    })),
    ...makeEmptyRows('budget', 15),
  ],
  pinnedTop: [{ id: CONFIG_ROW_ID, category: 'Monthly income', budgeted: 4200 }],
  pinnedBottom: [
    {
      id: 'totals',
      category: 'Totals',
      budgeted: '=SUM(COLUMN_VALUES("budgeted"))',
      actual: '=SUM(COLUMN_VALUES("actual"))',
      variance: '=SUM(COLUMN_VALUES("variance"))',
      share: `=SUM(COLUMN_VALUES("actual")) / ${INCOME_REF}`,
    },
  ],
  customFunctionHint: 'Try =MARGIN(budgeted, actual) in an empty cell',
};

// --- Grade book --------------------------------------------------------------
// Columns: A student, B homework, C midterm, D final, E weighted, F grade,
// G vs class average. The assignment weights live in the pinned-top row at
// (2, 1), (3, 1), and (4, 1) — `$B$1`, `$C$1`, `$D$1`.

const gradebookFormulas = {
  weighted:
    '=ROUND(homework * REF(COLUMN_POSITION(2), ROW_POSITION(1)) + midterm * REF(COLUMN_POSITION(3), ROW_POSITION(1)) + final * REF(COLUMN_POSITION(4), ROW_POSITION(1)), 1)',
  grade:
    '=IF(weighted >= 90, "A", IF(weighted >= 80, "B", IF(weighted >= 70, "C", IF(weighted >= 60, "D", "F"))))',
  delta: '=ROUND(weighted - AVERAGE(COLUMN_VALUES("weighted")), 1)',
};

const gradebookStudents: Array<[string, number, number, number]> = [
  ['Alice Johnson', 92, 88, 95],
  ['Bruno Costa', 78, 82, 74],
  ['Chloe Dubois', 85, 91, 89],
  ['Daniel Kim', 64, 71, 68],
  ['Elena Petrova', 96, 93, 98],
  ['Farid Hassan', 70, 65, 72],
  ['Grace Liu', 88, 84, 90],
  ['Hugo Schmidt', 59, 62, 55],
  ['Isabella Rossi', 81, 79, 85],
  ['Jamal Wright', 74, 80, 77],
  ['Kenji Sato', 90, 94, 91],
  ['Lena Novak', 67, 73, 70],
];

const gradebookTemplate: PlaygroundTemplate = {
  id: 'gradebook',
  label: 'Grade book',
  sheetName: 'Grades',
  columns: withSortBlanksLast([
    { field: 'student', headerName: 'Student', width: 160, editable: true, allowFormulas: true },
    {
      field: 'homework',
      headerName: 'Homework',
      type: 'number',
      width: 115,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatScoreOrWeight,
    },
    {
      field: 'midterm',
      headerName: 'Midterm',
      type: 'number',
      width: 110,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatScoreOrWeight,
    },
    {
      field: 'final',
      headerName: 'Final',
      type: 'number',
      width: 100,
      editable: true,
      allowFormulas: true,
      valueFormatter: formatScoreOrWeight,
    },
    {
      field: 'weighted',
      headerName: 'Weighted',
      type: 'number',
      width: 115,
      editable: true,
      allowFormulas: true,
    },
    {
      field: 'grade',
      headerName: 'Grade',
      width: 85,
      editable: true,
      allowFormulas: true,
      cellClassName: gradeClassName,
    },
    {
      field: 'delta',
      headerName: 'Vs class avg',
      type: 'number',
      width: 125,
      editable: true,
      allowFormulas: true,
    },
  ]),
  rows: [
    ...gradebookStudents.map(([student, homework, midterm, final], index) => ({
      id: `student-${index + 1}`,
      student,
      homework,
      midterm,
      final,
      ...gradebookFormulas,
    })),
    ...makeEmptyRows('gradebook', 15),
  ],
  pinnedTop: [{ id: CONFIG_ROW_ID, student: 'Weights', homework: 0.3, midterm: 0.3, final: 0.4 }],
  pinnedBottom: [
    {
      id: 'totals',
      student: 'Class average',
      homework: '=ROUND(AVERAGE(COLUMN_VALUES("homework")), 1)',
      midterm: '=ROUND(AVERAGE(COLUMN_VALUES("midterm")), 1)',
      final: '=ROUND(AVERAGE(COLUMN_VALUES("final")), 1)',
      weighted: '=ROUND(AVERAGE(COLUMN_VALUES("weighted")), 1)',
    },
  ],
  customFunctionHint: 'Try =TIER(weighted, 90, 80) in an empty cell',
};

export const TEMPLATES: Record<TemplateId, PlaygroundTemplate> = {
  commission: commissionTemplate,
  budget: budgetTemplate,
  gradebook: gradebookTemplate,
};

export const TEMPLATE_IDS: TemplateId[] = ['commission', 'budget', 'gradebook'];
