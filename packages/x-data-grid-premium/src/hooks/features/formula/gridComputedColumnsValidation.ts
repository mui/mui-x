import type { RefObject } from '@mui/x-internals/types';
import type { GridColDef, GridLocaleText } from '@mui/x-data-grid-pro';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type {
  GridComputedColumnDefinition,
  GridComputedColumnValidationIssue,
  GridComputedColumnValidationResult,
} from '../computedColumns/gridComputedColumnsInterfaces';
import {
  collectFunctionCallIssues,
  extractFormulaDependencies,
  getFormulaExpression,
  orderForRecompute,
} from './engine';
import type { FormulaErrorCode, FormulaFunctionRegistry, FormulaParser } from './engine';
import { applyComputedColDefOverrides, withComputedHeaderClassName } from './createComputedColDef';
import { resetComputedResults } from './gridComputedColumnsRuntime';
import { isPositionedDataField } from './gridFormulaPositionContext';
import type {
  GridComputedColumnRecord,
  GridFormulaInternalCache,
  GridFormulaResult,
} from './gridFormulaInterfaces';

const VALID_FIELD_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;
const A1_LIKE_FIELD_REGEX = /^[a-zA-Z]{1,3}\d+$/;
const FUNCTION_NAME_REGEX = /^[A-Za-z_][A-Za-z0-9_.]*/;

export const COMPUTED_COLUMN_CYCLE_PATH_SEPARATOR = ' → ';

/**
 * What a definition is validated against.
 */
export interface GridComputedColumnValidationScope {
  getLocaleText: <K extends keyof GridLocaleText>(key: K) => GridLocaleText[K];
  parser: FormulaParser;
  functions: FormulaFunctionRegistry;
  /**
   * If `true`, a field that reads as a cell address (`q1`) is reported.
   */
  a1Notation: boolean;
  /**
   * The fields of the columns that are not computed columns.
   */
  columnFields: ReadonlySet<string>;
  /**
   * The fields a computed column can read: the data columns and the computed columns.
   */
  referenceableFields: ReadonlySet<string>;
  /**
   * For each stored computed column, the fields its formula reads directly —
   * including the ones no column holds yet, which a definition may bring.
   */
  computedDependencies: ReadonlyMap<string, ReadonlySet<string>>;
}

export interface GridComputedColumnVerdict {
  issues: GridComputedColumnValidationIssue[];
  /**
   * The result of every row when the formula cannot be evaluated, `null` otherwise.
   * The issues about the name and the field never prevent the evaluation.
   */
  staticResult: GridFormulaResult | null;
}

/**
 * The scope of the columns in `columnsLookup` and of the stored computed columns.
 * @param {RefObject<GridPrivateApiPremium>} apiRef The private grid api.
 * @param {GridFormulaInternalCache} cache The internal cache of the formula feature.
 * @param {Record<string, GridColDef>} columnsLookup The columns to validate against.
 * @param {boolean} a1Notation If `true`, A1 notation is active.
 * @returns {GridComputedColumnValidationScope} The validation scope.
 */
export function createComputedColumnValidationScope(
  apiRef: RefObject<GridPrivateApiPremium>,
  cache: GridFormulaInternalCache,
  columnsLookup: Record<string, GridColDef>,
  a1Notation: boolean,
): GridComputedColumnValidationScope {
  const { records } = cache.computedColumns;
  const columnFields = new Set<string>();
  const referenceableFields = new Set<string>(records.keys());
  for (const field of Object.keys(columnsLookup)) {
    if (columnsLookup[field].computed) {
      continue;
    }
    columnFields.add(field);
    if (isPositionedDataField(field)) {
      referenceableFields.add(field);
    }
  }

  const computedDependencies = new Map<string, ReadonlySet<string>>();
  for (const [field, record] of records) {
    computedDependencies.set(field, record.dependencies);
  }

  return {
    getLocaleText: apiRef.current.getLocaleText,
    parser: cache.parser,
    functions: cache.registry,
    a1Notation,
    columnFields,
    referenceableFields,
    computedDependencies,
  };
}

/**
 * The path of the cycle going through `field`, starting and ending with it,
 * or `null` when the field is only downstream of a cycle.
 */
function findCyclePath(
  field: string,
  cyclic: ReadonlySet<string>,
  graph: ReadonlyMap<string, ReadonlySet<string>>,
): string[] | null {
  const visited = new Set<string>();
  const stack: { node: string; path: string[] }[] = [{ node: field, path: [field] }];
  while (stack.length > 0) {
    const { node, path } = stack.pop()!;
    const dependencies = graph.get(node);
    if (dependencies === undefined) {
      continue;
    }
    // Reversed so the dependencies are explored in the order of the formula.
    const ordered = Array.from(dependencies).reverse();
    for (const dependency of ordered) {
      if (dependency === field) {
        return [...path, field];
      }
    }
    for (const dependency of ordered) {
      if (cyclic.has(dependency) && !visited.has(dependency)) {
        visited.add(dependency);
        stack.push({ node: dependency, path: [...path, dependency] });
      }
    }
  }
  return null;
}

function createStaticResult(code: FormulaErrorCode, message: string): GridFormulaResult {
  return { type: 'error', code, message };
}

/**
 * Validates a definition (D32). Only the issues of the formula make the column
 * invalid: they come with the error shown by every row instead of an evaluation.
 * @param {GridComputedColumnDefinition} definition The definition to validate.
 * @param {GridComputedColumnValidationScope} scope What the definition is validated against.
 * @param {object} options The validation options.
 * @param {string} options.ignoreField The field of the stored definition that `definition` replaces.
 * @returns {GridComputedColumnVerdict} The issues and the static result of the definition.
 */
export function getComputedColumnVerdict(
  definition: GridComputedColumnDefinition,
  scope: GridComputedColumnValidationScope,
  options: { ignoreField?: string } = {},
): GridComputedColumnVerdict {
  const { getLocaleText } = scope;
  const { ignoreField } = options;
  const issues: GridComputedColumnValidationIssue[] = [];
  let staticResult: GridFormulaResult | null = null;
  const addFormulaIssue = (issue: GridComputedColumnValidationIssue, code: FormulaErrorCode) => {
    issues.push(issue);
    staticResult ??= createStaticResult(code, issue.message);
  };

  const headerName = typeof definition.headerName === 'string' ? definition.headerName : '';
  if (headerName.trim() === '') {
    issues.push({
      code: 'nameRequired',
      message: getLocaleText('computedColumnErrorNameRequired'),
    });
  }

  const field = typeof definition.field === 'string' ? definition.field : '';
  if (field.trim() === '') {
    issues.push({
      code: 'fieldRequired',
      message: getLocaleText('computedColumnErrorFieldRequired'),
    });
  } else if (!VALID_FIELD_REGEX.test(field)) {
    issues.push({
      code: 'fieldInvalid',
      message: getLocaleText('computedColumnErrorFieldInvalid'),
    });
  } else {
    if (
      scope.columnFields.has(field) ||
      (scope.computedDependencies.has(field) && field !== ignoreField)
    ) {
      issues.push({
        code: 'fieldExists',
        message: getLocaleText('computedColumnErrorFieldExists')(field),
        field,
      });
    }
    if (scope.a1Notation && A1_LIKE_FIELD_REGEX.test(field)) {
      issues.push({
        code: 'fieldA1Like',
        message: getLocaleText('computedColumnErrorFieldA1Like'),
      });
    }
  }

  const formula = typeof definition.formula === 'string' ? definition.formula : '';
  const expression = getFormulaExpression(formula);
  // The spans of the engine are relative to the expression, the ones of the issues to the source.
  const spanOffset = formula.length - expression.length;
  if (expression.trim() === '') {
    addFormulaIssue(
      { code: 'formulaRequired', message: getLocaleText('computedColumnErrorFormulaRequired') },
      '#ERROR!',
    );
    return { issues, staticResult };
  }

  const parse = scope.parser.parse(expression);
  if (parse.ast === null) {
    const issue: GridComputedColumnValidationIssue = {
      code: 'parseError',
      message: getLocaleText('computedColumnErrorParse')(
        parse.error?.message ?? 'The formula could not be parsed.',
      ),
    };
    if (parse.error != null) {
      issue.span = {
        start: parse.error.span.start + spanOffset,
        end: parse.error.span.end + spanOffset,
      };
    }
    addFormulaIssue(issue, '#ERROR!');
    return { issues, staticResult };
  }

  const dependencies = extractFormulaDependencies(parse.ast);
  if (
    dependencies.usesPositionContext ||
    dependencies.cellRefs.length > 0 ||
    dependencies.ranges.length > 0 ||
    dependencies.columnValues.size > 0
  ) {
    addFormulaIssue(
      {
        code: 'unsupportedReference',
        message: getLocaleText('computedColumnErrorUnsupportedReference'),
      },
      '#REF!',
    );
  }

  if (field !== '' && dependencies.fieldRefs.has(field)) {
    addFormulaIssue(
      { code: 'selfReference', message: getLocaleText('computedColumnErrorSelfReference') },
      '#CYCLE!',
    );
  } else if (field !== '') {
    // The definition takes the place of the stored one it replaces in the graph.
    const storedDependencies = new Map(scope.computedDependencies);
    if (ignoreField !== undefined) {
      storedDependencies.delete(ignoreField);
    }
    // The stored columns may read `field` before any column holds it: this
    // definition closes those edges. It does not when `field` is a data column
    // — the stored formulas read that column, and the field is reported above.
    const bringsField = !scope.columnFields.has(field);
    const graph = new Map<string, ReadonlySet<string>>();
    for (const [storedField, storedFieldDependencies] of storedDependencies) {
      const edges = new Set<string>();
      for (const dependency of storedFieldDependencies) {
        if (storedDependencies.has(dependency) || (bringsField && dependency === field)) {
          edges.add(dependency);
        }
      }
      graph.set(storedField, edges);
    }
    const computedDependencies = new Set<string>();
    for (const dependency of dependencies.fieldRefs) {
      if (storedDependencies.has(dependency)) {
        computedDependencies.add(dependency);
      }
    }
    graph.set(field, computedDependencies);
    const { cyclic } = orderForRecompute(new Set(graph.keys()), (key) => graph.get(key));
    const path = cyclic.has(field) ? findCyclePath(field, cyclic, graph) : null;
    if (path !== null) {
      addFormulaIssue(
        {
          code: 'cycle',
          message: getLocaleText('computedColumnErrorCycle')(
            path.join(COMPUTED_COLUMN_CYCLE_PATH_SEPARATOR),
          ),
          path,
        },
        '#CYCLE!',
      );
    }
  }

  for (const dependency of dependencies.fieldRefs) {
    // The stored definition being replaced is only known under the field of its replacement.
    if (
      dependency !== field &&
      (!scope.referenceableFields.has(dependency) || dependency === ignoreField)
    ) {
      addFormulaIssue(
        {
          code: 'unknownField',
          message: getLocaleText('computedColumnErrorUnknownField')(dependency),
          field: dependency,
        },
        '#REF!',
      );
    }
  }

  for (const functionIssue of collectFunctionCallIssues(parse.ast, scope.functions)) {
    const span =
      functionIssue.span === undefined
        ? undefined
        : {
            start: functionIssue.span.start + spanOffset,
            end: functionIssue.span.end + spanOffset,
          };
    if (functionIssue.code === '#NAME?') {
      const name =
        functionIssue.span === undefined
          ? null
          : FUNCTION_NAME_REGEX.exec(expression.slice(functionIssue.span.start));
      const issue: GridComputedColumnValidationIssue = {
        code: 'unknownFunction',
        message:
          name === null
            ? functionIssue.message
            : getLocaleText('computedColumnErrorUnknownFunction')(name[0].toUpperCase()),
      };
      if (span !== undefined) {
        issue.span = span;
      }
      addFormulaIssue(issue, '#NAME?');
    } else {
      // The validation codes have no entry for the number of arguments:
      // it is reported like a syntax problem, with the message of the engine.
      const issue: GridComputedColumnValidationIssue = {
        code: 'parseError',
        message: getLocaleText('computedColumnErrorParse')(functionIssue.message),
      };
      if (span !== undefined) {
        issue.span = span;
      }
      addFormulaIssue(issue, functionIssue.code);
    }
  }

  return { issues, staticResult };
}

export function validateComputedColumnDefinition(
  definition: GridComputedColumnDefinition,
  scope: GridComputedColumnValidationScope,
  options?: { ignoreField?: string },
): GridComputedColumnValidationResult {
  const { issues } = getComputedColumnVerdict(definition, scope, options);
  return { valid: issues.length === 0, issues };
}

function areSpansEqual(
  a: GridComputedColumnValidationIssue['span'],
  b: GridComputedColumnValidationIssue['span'],
): boolean {
  return a === b || (a !== undefined && b !== undefined && a.start === b.start && a.end === b.end);
}

function areIssuesEqual(
  a: GridComputedColumnValidationIssue[],
  b: GridComputedColumnValidationIssue[],
): boolean {
  return (
    a.length === b.length &&
    a.every((issue, index) => {
      const other = b[index];
      return (
        issue.code === other.code &&
        issue.message === other.message &&
        issue.field === other.field &&
        areSpansEqual(issue.span, other.span) &&
        (issue.path ?? []).join('\n') === (other.path ?? []).join('\n')
      );
    })
  );
}

function areStaticResultsEqual(a: GridFormulaResult | null, b: GridFormulaResult | null): boolean {
  if (a === null || b === null) {
    return a === b;
  }
  return a.type === 'error' && b.type === 'error' && a.code === b.code && a.message === b.message;
}

/**
 * Validates the stored definitions against the columns being hydrated and writes
 * the verdict in their records. A record — and so its column definition — is only
 * replaced when its verdict changed.
 * @param {RefObject<GridPrivateApiPremium>} apiRef The private grid api.
 * @param {GridFormulaInternalCache} cache The internal cache of the formula feature.
 * @param {Record<string, GridColDef>} columnsLookup The columns being hydrated.
 * @param {boolean} a1Notation If `true`, A1 notation is active.
 * @param {DataGridPremiumProcessedProps['computedColDef']} computedColDef The `computedColDef` prop.
 */
export function validateComputedColumnRecords(
  apiRef: RefObject<GridPrivateApiPremium>,
  cache: GridFormulaInternalCache,
  columnsLookup: Record<string, GridColDef>,
  a1Notation: boolean,
  computedColDef: DataGridPremiumProcessedProps['computedColDef'],
) {
  const { records } = cache.computedColumns;
  if (records.size === 0) {
    return;
  }
  const scope = createComputedColumnValidationScope(apiRef, cache, columnsLookup, a1Notation);
  let staticResultsChanged = false;
  for (const [field, record] of records) {
    const verdict = getComputedColumnVerdict(record.definition, scope, { ignoreField: field });
    const sameStaticResult = areStaticResultsEqual(verdict.staticResult, record.staticResult);
    if (sameStaticResult && areIssuesEqual(verdict.issues, record.issues)) {
      continue;
    }
    let nextRecord: GridComputedColumnRecord = { ...record, ...verdict };
    if (!sameStaticResult) {
      staticResultsChanged = true;
      if ((verdict.staticResult === null) !== (record.staticResult === null)) {
        const baseColDef = withComputedHeaderClassName(
          record.baseColDef,
          verdict.staticResult !== null,
        );
        nextRecord = {
          ...nextRecord,
          baseColDef,
          colDef: applyComputedColDefOverrides(baseColDef, record.definition, computedColDef),
        };
      }
    }
    records.set(field, nextRecord);
  }
  if (staticResultsChanged) {
    resetComputedResults(cache);
  }
}
