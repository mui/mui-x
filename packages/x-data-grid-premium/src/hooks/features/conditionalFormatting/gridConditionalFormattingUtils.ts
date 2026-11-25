import { warnOnce } from '@mui/x-internals/warning';
import type { RefObject } from '@mui/x-internals/types';
import { gridClasses } from '@mui/x-data-grid-pro';
import type { ConditionalFormattingOptions, Style } from '@mui/x-internal-exceljs-fork';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { gridConditionalFormattingSelector } from './gridConditionalFormattingSelectors';
import type {
  GridConditionalFormattingCellCondition,
  GridConditionalFormattingCondition,
  GridConditionalFormattingModel,
  GridConditionalFormattingStyle,
  GridConditionalFormattingTextCondition,
  GridConditionalFormattingValue,
} from './gridConditionalFormattingInterfaces';

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const sanitizeColor = (color: unknown): string | undefined => {
  if (color === undefined) {
    return undefined;
  }
  if (typeof color === 'string' && HEX_COLOR.test(color)) {
    return color;
  }
  if (process.env.NODE_ENV !== 'production') {
    warnOnce(
      `MUI X Data Grid: The conditional formatting color ${JSON.stringify(color)} is ignored. Use a hex color like "#ff0000".`,
    );
  }
  return undefined;
};

/**
 * Keeps the known properties with a valid value: the style comes from the
 * model, which can be restored from untrusted data, and ends up in a stylesheet.
 */
export function sanitizeConditionalFormattingStyle(
  style: GridConditionalFormattingStyle | undefined,
): GridConditionalFormattingStyle {
  const result: GridConditionalFormattingStyle = {};
  if (style == null) {
    return result;
  }
  const color = sanitizeColor(style.color);
  if (color !== undefined) {
    result.color = color;
  }
  const backgroundColor = sanitizeColor(style.backgroundColor);
  if (backgroundColor !== undefined) {
    result.backgroundColor = backgroundColor;
  }
  if (style.fontWeight === 'bold') {
    result.fontWeight = 'bold';
  }
  if (style.fontStyle === 'italic') {
    result.fontStyle = 'italic';
  }
  if (style.textDecoration === 'underline' || style.textDecoration === 'line-through') {
    result.textDecoration = style.textDecoration;
  }
  return result;
}

export const getConditionalFormattingClassName = (instanceId: number, index: number) =>
  `MuiDataGrid-conditionalFormatting-${instanceId}-${index}`;

/**
 * The styles of the rules, for the `sx` of the grid root. The first rule is
 * written last so it wins when several rules set the same property. The
 * background is not applied to selected cells, so the selection stays visible.
 */
export function getConditionalFormattingStyles(
  model: GridConditionalFormattingModel,
  instanceId: number,
) {
  const styles: Record<
    string,
    Omit<GridConditionalFormattingStyle, 'fontWeight'> & { fontWeight?: string }
  > = {};
  for (let i = model.length - 1; i >= 0; i -= 1) {
    const { backgroundColor, ...textStyle } = sanitizeConditionalFormattingStyle(model[i].style);
    const selector = `& .${gridClasses.cell}.${getConditionalFormattingClassName(instanceId, i)}`;
    if (Object.keys(textStyle).length > 0) {
      styles[selector] = textStyle;
    }
    if (backgroundColor !== undefined) {
      styles[`${selector}:not(.Mui-selected)`] = { backgroundColor };
    }
  }
  return styles;
}

type Comparable = { kind: 'number'; value: number } | { kind: 'string'; value: string };

const toComparable = (value: unknown): Comparable | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? { kind: 'number', value } : null;
  }
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? null : { kind: 'number', value: time };
  }
  if (typeof value === 'string') {
    return { kind: 'string', value: value.toLowerCase() };
  }
  return null;
};

const compare = (a: number | string, b: number | string) => {
  if (a < b) {
    return -1;
  }
  return a > b ? 1 : 0;
};

const NEGATED_OPERATORS = {
  notEqual: 'equal',
  notBetween: 'between',
  notContains: 'contains',
  isNotEmpty: 'isEmpty',
} as const;

function matchesCellCondition(
  condition: GridConditionalFormattingCellCondition,
  cellValue: unknown,
): boolean {
  const { operator } = condition;
  if (operator === 'notEqual' || operator === 'notBetween') {
    return !matchesCellCondition(
      { ...condition, operator: NEGATED_OPERATORS[operator] },
      cellValue,
    );
  }
  const ruleValue = toComparable(condition.value);
  const value = toComparable(cellValue);
  if (ruleValue === null || value === null || ruleValue.kind !== value.kind) {
    return false;
  }
  const order = compare(value.value, ruleValue.value);
  switch (operator) {
    case 'equal':
      return order === 0;
    case 'greaterThan':
      return order > 0;
    case 'greaterThanOrEqual':
      return order >= 0;
    case 'lessThan':
      return order < 0;
    case 'lessThanOrEqual':
      return order <= 0;
    case 'between': {
      const upper = toComparable(condition.valueTo);
      return (
        upper !== null && upper.kind === value.kind && order >= 0 && value.value <= upper.value
      );
    }
    default:
      return false;
  }
}

const toText = (value: unknown) => (value == null ? '' : String(value));

function matchesTextCondition(
  condition: GridConditionalFormattingTextCondition,
  cellValue: unknown,
): boolean {
  const { operator } = condition;
  if (operator === 'notContains' || operator === 'isNotEmpty') {
    return !matchesTextCondition(
      { ...condition, operator: NEGATED_OPERATORS[operator] },
      cellValue,
    );
  }
  const text = toText(cellValue).toLowerCase();
  const search = toText(condition.value).toLowerCase();
  switch (operator) {
    case 'contains':
      return text.includes(search);
    case 'startsWith':
      return text.startsWith(search);
    case 'endsWith':
      return text.endsWith(search);
    case 'isEmpty':
      return text.trim() === '';
    default:
      return false;
  }
}

/**
 * @returns {boolean} `true` when the value matches a `cell` or `text` condition. `false` for a `formula` condition.
 */
export function matchesConditionalFormattingValue(
  condition: GridConditionalFormattingCondition,
  cellValue: unknown,
): boolean {
  if (condition.type === 'cell') {
    return matchesCellCondition(condition, cellValue);
  }
  if (condition.type === 'text') {
    return matchesTextCondition(condition, cellValue);
  }
  return false;
}

const toExcelString = (value: string) => `"${value.replace(/"/g, '""')}"`;

const toExcelLiteral = (value: GridConditionalFormattingValue | undefined): string | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : null;
  }
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }
    // Local components, like the date cells of the export.
    return `(DATE(${value.getFullYear()},${value.getMonth() + 1},${value.getDate()})+TIME(${value.getHours()},${value.getMinutes()},${value.getSeconds()}))`;
  }
  if (typeof value === 'string') {
    return toExcelString(value);
  }
  return null;
};

const EXCEL_OPERATORS = {
  equal: '=',
  greaterThan: '>',
  greaterThanOrEqual: '>=',
  lessThan: '<',
  lessThanOrEqual: '<=',
} as const;

function getCellConditionExcelFormula(
  condition: GridConditionalFormattingCellCondition,
  cell: string,
): string | null {
  const { operator } = condition;
  if (operator === 'notEqual' || operator === 'notBetween') {
    const formula = getCellConditionExcelFormula(
      { ...condition, operator: NEGATED_OPERATORS[operator] },
      cell,
    );
    return formula === null ? null : `NOT(${formula})`;
  }
  const value = toExcelLiteral(condition.value);
  if (value === null) {
    return null;
  }
  // Excel compares text and numbers across types (text is greater than any
  // number, a blank cell is 0): the guard matches the grid, where they never match.
  const guard = typeof condition.value === 'string' ? `ISTEXT(${cell})` : `ISNUMBER(${cell})`;
  if (operator === 'between') {
    const upper = toExcelLiteral(condition.valueTo);
    const isTextRange = typeof condition.value === 'string';
    if (upper === null || isTextRange !== (typeof condition.valueTo === 'string')) {
      return null;
    }
    return `AND(${guard},${cell}>=${value},${cell}<=${upper})`;
  }
  const excelOperator = EXCEL_OPERATORS[operator];
  if (excelOperator === undefined) {
    return null;
  }
  return `AND(${guard},${cell}${excelOperator}${value})`;
}

function getTextConditionExcelFormula(
  condition: GridConditionalFormattingTextCondition,
  cell: string,
): string | null {
  const text = toText(condition.value);
  switch (condition.operator) {
    case 'contains':
    case 'notContains': {
      // `SEARCH` reads `*`, `?` and `~` as wildcards.
      const formula = `ISNUMBER(SEARCH(${toExcelString(text.replace(/[~*?]/g, '~$&'))},${cell}))`;
      return condition.operator === 'contains' ? formula : `NOT(${formula})`;
    }
    case 'startsWith':
      return `LEFT(${cell},${text.length})=${toExcelString(text)}`;
    case 'endsWith':
      return `RIGHT(${cell},${text.length})=${toExcelString(text)}`;
    case 'isEmpty':
      return `LEN(TRIM(${cell}))=0`;
    case 'isNotEmpty':
      return `LEN(TRIM(${cell}))>0`;
    default:
      return null;
  }
}

const toArgb = (color: string) => {
  const hex =
    color.length === 4
      ? color
          .slice(1)
          .split('')
          .map((char) => char + char)
          .join('')
      : color.slice(1);
  return `FF${hex.toUpperCase()}`;
};

export function getConditionalFormattingExcelStyle(
  style: GridConditionalFormattingStyle,
): Partial<Style> | null {
  const { color, backgroundColor, fontWeight, fontStyle, textDecoration } =
    sanitizeConditionalFormattingStyle(style);
  const excelStyle: Partial<Style> = {};
  const font: Partial<Style['font']> = {};
  if (color !== undefined) {
    font.color = { argb: toArgb(color) };
  }
  if (fontWeight === 'bold') {
    font.bold = true;
  }
  if (fontStyle === 'italic') {
    font.italic = true;
  }
  if (textDecoration === 'underline') {
    font.underline = true;
  }
  if (textDecoration === 'line-through') {
    font.strike = true;
  }
  if (Object.keys(font).length > 0) {
    excelStyle.font = font;
  }
  if (backgroundColor !== undefined) {
    // Conditional formats read the solid fill color from `bgColor`.
    const argb = toArgb(backgroundColor);
    excelStyle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb }, bgColor: { argb } };
  }
  return Object.keys(excelStyle).length > 0 ? excelStyle : null;
}

export interface ConditionalFormattingExcelLayout {
  fieldToColumnLetter: Map<string, string>;
  firstDataRowNumber: number;
  lastDataRowNumber: number;
}

/**
 * One Excel conditional format per rule and exported column, with the formula
 * written for the top-left cell of the column range. Rules that cannot be
 * exported are skipped.
 * @param {GridConditionalFormattingModel} model The rules.
 * @param {ConditionalFormattingExcelLayout} layout Where the exported columns and rows are.
 * @param {Function} getFormulaExcelFormula Converts the formula of a `formula` condition.
 * @returns {ConditionalFormattingOptions[]} The conditional formats to add to the worksheet.
 */
export function getConditionalFormattingExcelOptions(
  model: GridConditionalFormattingModel,
  layout: ConditionalFormattingExcelLayout,
  getFormulaExcelFormula:
    | ((
        formula: string,
        fieldToColumnLetter: Map<string, string>,
        rowNumber: number,
      ) => string | null)
    | undefined,
): ConditionalFormattingOptions[] {
  const { fieldToColumnLetter, firstDataRowNumber, lastDataRowNumber } = layout;
  const options: ConditionalFormattingOptions[] = [];
  if (lastDataRowNumber < firstDataRowNumber) {
    return options;
  }
  model.forEach((rule, index) => {
    const style = getConditionalFormattingExcelStyle(rule.style);
    if (style === null) {
      return;
    }
    const { condition } = rule;
    // The formula of a `formula` condition only reads other columns: it is the same for every column.
    const sharedFormula =
      condition.type === 'formula'
        ? (getFormulaExcelFormula?.(condition.formula, fieldToColumnLetter, firstDataRowNumber) ??
          null)
        : undefined;
    for (const field of rule.fields) {
      const letter = fieldToColumnLetter.get(field);
      if (letter === undefined) {
        continue;
      }
      const cell = `${letter}${firstDataRowNumber}`;
      let formula: string | null = null;
      if (condition.type === 'formula') {
        formula = sharedFormula ?? null;
      } else if (condition.type === 'cell') {
        formula = getCellConditionExcelFormula(condition, cell);
      } else if (condition.type === 'text') {
        formula = getTextConditionExcelFormula(condition, cell);
      }
      if (formula === null) {
        continue;
      }
      options.push({
        ref: `${cell}:${letter}${lastDataRowNumber}`,
        rules: [{ type: 'expression', priority: index + 1, formulae: [formula], style }],
      });
    }
  });
  return options;
}

const toColumnLetters = (index: number) => {
  let letters = '';
  for (let rest = index + 1; rest > 0; rest = Math.floor((rest - 1) / 26)) {
    letters = String.fromCharCode(65 + ((rest - 1) % 26)) + letters;
  }
  return letters;
};

/**
 * The conditional formats of an export whose data rows are `firstDataRowNumber..lastDataRowNumber`.
 */
export function getConditionalFormattingExcelExport(
  apiRef: RefObject<GridPrivateApiPremium>,
  fields: string[],
  firstDataRowNumber: number,
  lastDataRowNumber: number,
): ConditionalFormattingOptions[] {
  const model = gridConditionalFormattingSelector(apiRef);
  if (model.length === 0) {
    return [];
  }
  const fieldToColumnLetter = new Map(
    fields.map((field, index) => [field, toColumnLetters(index)]),
  );
  return getConditionalFormattingExcelOptions(
    model,
    { fieldToColumnLetter, firstDataRowNumber, lastDataRowNumber },
    apiRef.current.getConditionalFormattingExcelFormula,
  );
}
