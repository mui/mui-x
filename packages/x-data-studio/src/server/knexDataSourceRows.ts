import type { GridColDef, GridFilterItem, GridRowModel } from '@mui/x-data-grid';
import { GridLogicOperator } from '@mui/x-data-grid';
import type { Knex } from 'knex';
import type { DataStudioGetRowsParams } from '../models';
import { DataStudioServerError } from './errors';
import {
  hydrateDataStudioGroupRows,
  hydrateDataStudioLeafRows,
  normalizeDataStudioDbRow,
} from './dataSourceRows';
import {
  buildDataStudioPivotColumnTree,
  DATA_STUDIO_CHILDREN_COUNT_FIELD,
  DATA_STUDIO_GROUP_KEY_FIELD,
  DATA_STUDIO_SYNTHETIC_ID_FIELD,
  getComputedFieldNames,
  getDataStudioAggregationFunction,
  getDataStudioPivotColumnFields,
  getDataStudioPivotRowFields,
  getDataStudioPivotValueField,
  getDataStudioPivotValues,
} from './synthesis';
import type { DataStudioComputedFields } from './types';
import { assertKnownField, getAllowedFields, getPaginationRange } from './utils';

interface KnexDataStudioRowsOptions {
  knex: Knex;
  /** Physical table for a plain source. Mutually exclusive with `from`. */
  table?: string;
  /**
   * Base-query factory for a derived source (e.g. a joint source's JOIN
   * subquery). Must return a FRESH builder per call — the engine clones and
   * mutates it heavily (count, aggregate, extent, pivot-tuple queries each
   * re-derive the base). Mutually exclusive with `table`.
   * @returns {Knex.QueryBuilder} A fresh base query builder.
   */
  from?: () => Knex.QueryBuilder;
  computedFields?: DataStudioComputedFields;
}

/**
 * The single point where the rows engine materialises its base query. A plain
 * source supplies `table`; a derived source (joint source) supplies a `from`
 * factory whose result the rest of the engine filters/groups/aggregates exactly
 * as if it were a flat table.
 */
function getKnexBaseQuery(options: KnexDataStudioRowsOptions): Knex.QueryBuilder {
  if (options.from) {
    return options.from();
  }
  if (options.table != null) {
    return options.knex(options.table);
  }
  throw /* minify-error-disabled */ new Error(
    'MUI X: Knex rows options require either `table` or `from`.',
  );
}

function escapeLike(value: unknown) {
  return String(value ?? '').replace(/[\\%_]/g, (match) => `\\${match}`);
}

function normalizeArray(value: unknown) {
  return Array.isArray(value) ? value : [value];
}

function getKnexComputedFieldExpression(
  knex: Knex,
  field: string,
  computedFields: DataStudioComputedFields | undefined,
): any {
  return computedFields?.[field]?.knex?.(knex) ?? field;
}

export function getKnexClientName(knex: Knex): string {
  const client: any = knex.client;
  return String(client?.config?.client ?? client?.dialect ?? '').toLowerCase();
}

// Quote a column identifier for inlining into a bin expression using knex's
// native, dialect-correct quoting (so it matches the rest of the generated query
// — e.g. backticks on better-sqlite3, not double quotes). Bin expressions are
// reused in SELECT + GROUP BY, so they must carry no bound params.
function quoteBinIdentifier(knex: Knex, field: string): string {
  return knex.raw('??', [field]).toString();
}

/**
 * SQL expression that buckets a date column to the requested granularity, per
 * dialect (e.g. `strftime('%Y-%m', col)` on SQLite). Falls back to the raw column
 * when the dialect is unknown so grouping still works (just unbucketed).
 */
function getKnexDateBinExpression(
  knex: Knex,
  field: string,
  granularity: 'day' | 'month' | 'quarter' | 'year',
): Knex.Raw | string {
  const client = getKnexClientName(knex);
  const col = quoteBinIdentifier(knex, field);
  if (client.includes('sqlite')) {
    switch (granularity) {
      case 'year':
        return knex.raw(`strftime('%Y', ${col})`);
      case 'day':
        return knex.raw(`strftime('%Y-%m-%d', ${col})`);
      case 'quarter':
        return knex.raw(
          `strftime('%Y', ${col}) || '-Q' || ((cast(strftime('%m', ${col}) as integer) + 2) / 3)`,
        );
      case 'month':
      default:
        return knex.raw(`strftime('%Y-%m', ${col})`);
    }
  }
  if (client.includes('pg') || client.includes('postgres')) {
    switch (granularity) {
      case 'year':
        return knex.raw(`to_char(${col}, 'YYYY')`);
      case 'day':
        return knex.raw(`to_char(${col}, 'YYYY-MM-DD')`);
      case 'quarter':
        return knex.raw(`to_char(${col}, 'YYYY') || '-Q' || to_char(${col}, 'Q')`);
      case 'month':
      default:
        return knex.raw(`to_char(${col}, 'YYYY-MM')`);
    }
  }
  if (client.includes('mysql')) {
    switch (granularity) {
      case 'year':
        return knex.raw(`date_format(${col}, '%Y')`);
      case 'day':
        return knex.raw(`date_format(${col}, '%Y-%m-%d')`);
      case 'quarter':
        return knex.raw(`concat(date_format(${col}, '%Y'), '-Q', quarter(${col}))`);
      case 'month':
      default:
        return knex.raw(`date_format(${col}, '%Y-%m')`);
    }
  }
  return field;
}

/**
 * The GROUP-BY expression for a field: a server-side date bucket when the request
 * declares a date `binning[field]`, otherwise the field's (possibly computed)
 * expression. Numeric binning needs the column range, so it's resolved separately
 * (async) by `getKnexNumericBinExpression`.
 */
function getKnexGroupExpression(
  knex: Knex,
  field: string,
  computedFields: DataStudioComputedFields | undefined,
  binning: DataStudioGetRowsParams['binning'],
): any {
  const directive = binning?.[field];
  if (directive?.kind === 'date') {
    return getKnexDateBinExpression(knex, field, directive.granularity);
  }
  return getKnexComputedFieldExpression(knex, field, computedFields);
}

/**
 * The GROUP-BY expression that buckets a numeric column into `bins` equal-width
 * brackets, keyed by the bracket's (rounded) lower bound. The column range is
 * computed server-side from the scoped query, then inlined into the bucket
 * expression (a dialect-agnostic `case`/`cast`/`round`).
 */
/**
 * Resolves the numeric-bin GROUP BY expression as a **SQL string** (not a
 * `knex.raw`). Returning a string is deliberate: this function is `async` (it
 * runs a MIN/MAX query first), and an `async` function that `return`s a
 * `knex.raw` has its promise *adopt* that raw — `knex.raw` is thenable, so
 * `await`ing the result executes the bare expression as a standalone statement
 * (`round(...)` → `near "round": syntax error`). The caller embeds the returned
 * string into its own raw SELECT/GROUP BY.
 */
async function getKnexNumericBinExpression(
  scopedQuery: Knex.QueryBuilder,
  knex: Knex,
  field: string,
  computedFields: DataStudioComputedFields | undefined,
  bins: number,
): Promise<string> {
  const fallback = getKnexComputedFieldExpression(knex, field, computedFields);
  const fallbackSql =
    typeof fallback === 'string' ? quoteBinIdentifier(knex, fallback) : fallback.toString();
  const extent = (await scopedQuery
    .clone()
    .clearSelect()
    .clearOrder()
    .first({ binMin: knex.raw('min(??)', [field]), binMax: knex.raw('max(??)', [field]) })) as
    | { binMin?: unknown; binMax?: unknown }
    | undefined;
  const min = Number(extent?.binMin);
  const max = Number(extent?.binMax);
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min || bins <= 1) {
    return fallbackSql;
  }
  const width = (max - min) / bins;
  const col = quoteBinIdentifier(knex, field);
  // Bracket lower bound = round(min + clamp(floor((col-min)/width), 0, bins-1) * width).
  // The expression is reused in SELECT + GROUP BY, where knex mis-serialises a raw
  // that contains ` as ` (e.g. `cast(... as int)`) or a top-level comma (`round(x, y)`)
  // — so we floor with `floor()` and round with single-arg `round()` (like the date
  // bucket starts with `strftime`). Buckets read as whole numbers.
  const index = `case when ${col} >= ${max} then ${bins - 1} else floor((${col} - ${min}) / ${width}) end`;
  return `round(${min} + (${index}) * ${width})`;
}

function getKnexComputedSelects(knex: Knex, computedFields: DataStudioComputedFields | undefined) {
  return Object.fromEntries(
    Object.entries(computedFields ?? {})
      .filter(([, computedField]) => Boolean(computedField.knex))
      .map(([field, computedField]) => [field, computedField.knex!(knex)]),
  );
}

function applyKnexComputedSelects(
  query: Knex.QueryBuilder,
  knex: Knex,
  computedFields: DataStudioComputedFields | undefined,
) {
  const computedSelects = getKnexComputedSelects(knex, computedFields);

  if (Object.keys(computedSelects).length > 0) {
    query.select(computedSelects);
  }
}

function applyKnexFilterItem(
  query: Knex.QueryBuilder,
  item: GridFilterItem,
  allowedFields: Set<string>,
  knex: Knex,
  computedFields: DataStudioComputedFields | undefined,
) {
  assertKnownField(item.field, allowedFields);
  const fieldExpression = getKnexComputedFieldExpression(knex, item.field, computedFields);

  switch (item.operator) {
    case 'contains':
      query.where(fieldExpression, 'like', `%${escapeLike(item.value)}%`);
      return;
    case 'doesNotContain':
      query.whereNot(fieldExpression, 'like', `%${escapeLike(item.value)}%`);
      return;
    case 'equals':
    case '=':
      query.where(fieldExpression, item.value);
      return;
    case 'doesNotEqual':
    case '!=':
      query.whereNot(fieldExpression, item.value);
      return;
    case 'startsWith':
      query.where(fieldExpression, 'like', `${escapeLike(item.value)}%`);
      return;
    case 'endsWith':
      query.where(fieldExpression, 'like', `%${escapeLike(item.value)}`);
      return;
    case 'isEmpty':
      query.where((builder) => {
        builder.whereNull(fieldExpression).orWhere(fieldExpression, '');
      });
      return;
    case 'isNotEmpty':
      query.whereNotNull(fieldExpression).whereNot(fieldExpression, '');
      return;
    case 'isAnyOf':
      query.whereIn(fieldExpression, normalizeArray(item.value));
      return;
    case '>':
    case '>=':
    case '<':
    case '<=':
      query.where(fieldExpression, item.operator, item.value);
      return;
    default:
      throw new DataStudioServerError(
        `MUI X Data Studio: Unsupported filter operator "${item.operator}".
This prevents Data Studio from translating the request to SQL.
Use a supported Data Grid filter operator or extend the Knex data source.`,
      );
  }
}

function applyKnexFilters(
  query: Knex.QueryBuilder,
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  knex: Knex,
  computedFields: DataStudioComputedFields | undefined,
  rowIdField?: string,
) {
  const allowedFields = new Set([
    ...getAllowedFields(columns, rowIdField),
    ...getComputedFieldNames(computedFields),
  ]);
  const filterItems = params.filterModel.items ?? [];

  if (filterItems.length > 0) {
    query.where((builder) => {
      filterItems.forEach((item, index) => {
        const method =
          index > 0 && params.filterModel.logicOperator === GridLogicOperator.Or
            ? 'orWhere'
            : 'where';

        builder[method]((nestedBuilder) => {
          applyKnexFilterItem(nestedBuilder, item, allowedFields, knex, computedFields);
        });
      });
    });
  }

  if (params.filterModel.quickFilterValues?.length) {
    const searchableFields = columns.map((column) => column.field);
    const quickFilterLogic = params.filterModel.quickFilterLogicOperator ?? GridLogicOperator.And;

    query.where((builder) => {
      params.filterModel.quickFilterValues!.forEach((value, valueIndex) => {
        const valueMethod =
          valueIndex > 0 && quickFilterLogic === GridLogicOperator.Or ? 'orWhere' : 'where';

        builder[valueMethod]((valueBuilder) => {
          searchableFields.forEach((field, fieldIndex) => {
            const fieldMethod = fieldIndex === 0 ? 'where' : 'orWhere';
            valueBuilder[fieldMethod](
              getKnexComputedFieldExpression(knex, field, computedFields),
              'like',
              `%${escapeLike(value)}%`,
            );
          });
        });
      });
    });
  }

  return query;
}

function parseCount(row: Record<string, unknown> | undefined) {
  if (!row) {
    return 0;
  }

  const value = row.count ?? row['count(*)'] ?? Object.values(row)[0];
  return Number(value);
}

function getKnexExpressionSQL(knex: Knex, expression: any) {
  if (typeof expression === 'string') {
    return knex.ref(expression).toQuery();
  }

  if (expression && typeof expression.toQuery === 'function') {
    return expression.toQuery();
  }

  return String(expression);
}

function getKnexAllowedFields(
  columns: GridColDef[],
  computedFields: DataStudioComputedFields | undefined,
  rowIdField?: string,
) {
  return new Set([
    ...getAllowedFields(columns, rowIdField),
    ...getComputedFieldNames(computedFields),
    DATA_STUDIO_GROUP_KEY_FIELD,
    DATA_STUDIO_CHILDREN_COUNT_FIELD,
    DATA_STUDIO_SYNTHETIC_ID_FIELD,
  ]);
}

function applyKnexGroupScope(
  query: Knex.QueryBuilder,
  knex: Knex,
  computedFields: DataStudioComputedFields | undefined,
  groupFields: string[],
  groupKeys: string[],
  binning: DataStudioGetRowsParams['binning'],
) {
  groupKeys.forEach((groupKey, index) => {
    query.where(
      getKnexGroupExpression(knex, groupFields[index], computedFields, binning),
      groupKey,
    );
  });

  return query;
}

function createKnexFilteredQuery(
  options: KnexDataStudioRowsOptions,
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  groupFields: string[] = [],
  groupKeys: string[] = [],
  rowIdField?: string,
) {
  const query = applyKnexFilters(
    getKnexBaseQuery(options),
    params,
    columns,
    options.knex,
    options.computedFields,
    rowIdField,
  );

  return applyKnexGroupScope(
    query,
    options.knex,
    options.computedFields,
    groupFields,
    groupKeys,
    params.binning,
  );
}

function createKnexCondition(
  knex: Knex,
  conditions: Array<{ field: string; value: string }>,
  computedFields: DataStudioComputedFields | undefined,
) {
  if (conditions.length === 0) {
    return '';
  }

  return conditions
    .map(({ field, value }) => {
      const expression = getKnexExpressionSQL(
        knex,
        getKnexComputedFieldExpression(knex, field, computedFields),
      );
      return knex.raw(`${expression} = ?`, [value]).toQuery();
    })
    .join(' and ');
}

function createKnexAggregationExpression(
  knex: Knex,
  field: string,
  aggregationFunction: string,
  computedFields: DataStudioComputedFields | undefined,
  condition?: string,
) {
  const normalizedAggregationFunction = getDataStudioAggregationFunction(aggregationFunction);

  const expression = getKnexExpressionSQL(
    knex,
    getKnexComputedFieldExpression(knex, field, computedFields),
  );
  const when = condition ? `case when ${condition} then` : '';
  const endNumber = condition ? ' else 0 end' : '';
  const endNullable = condition ? ' else null end' : '';

  switch (normalizedAggregationFunction) {
    case 'sum':
      return knex.raw(condition ? `sum(${when} ${expression}${endNumber})` : `sum(${expression})`);
    case 'avg':
      return knex.raw(
        condition ? `avg(${when} ${expression}${endNullable})` : `avg(${expression})`,
      );
    case 'min':
      return knex.raw(
        condition ? `min(${when} ${expression}${endNullable})` : `min(${expression})`,
      );
    case 'max':
      return knex.raw(
        condition ? `max(${when} ${expression}${endNullable})` : `max(${expression})`,
      );
    case 'size':
      return knex.raw(condition ? `sum(${when} 1${endNumber})` : 'count(*)');
    case 'sizeTrue':
      return knex.raw(
        condition
          ? `sum(case when ${condition} and ${expression} = ? then 1 else 0 end)`
          : `sum(case when ${expression} = ? then 1 else 0 end)`,
        [true],
      );
    case 'sizeFalse':
      return knex.raw(
        condition
          ? `sum(case when ${condition} and ${expression} = ? then 1 else 0 end)`
          : `sum(case when ${expression} = ? then 1 else 0 end)`,
        [false],
      );
    default:
      throw /* minify-error-disabled */ new Error('MUI X: Unreachable');
  }
}

function createKnexAggregationSelects(
  knex: Knex,
  aggregationModel: Record<string, string> | undefined,
  computedFields: DataStudioComputedFields | undefined,
) {
  return Object.fromEntries(
    Object.entries(aggregationModel ?? {}).map(([field, aggregationFunction]) => [
      field,
      createKnexAggregationExpression(knex, field, aggregationFunction, computedFields),
    ]),
  );
}

function selectKnexExpressions(query: Knex.QueryBuilder, expressions: Record<string, Knex.Raw>) {
  if (Object.keys(expressions).length > 0) {
    query.select(expressions);
  }

  return query;
}

async function getKnexAggregateRow(
  query: Knex.QueryBuilder,
  knex: Knex,
  aggregationModel: Record<string, string> | undefined,
  computedFields: DataStudioComputedFields | undefined,
) {
  return getKnexAggregateRowFromSelects(
    query,
    createKnexAggregationSelects(knex, aggregationModel, computedFields),
  );
}

async function getKnexAggregateRowFromSelects(
  query: Knex.QueryBuilder,
  aggregateSelects: Record<string, Knex.Raw>,
) {
  if (Object.keys(aggregateSelects).length === 0) {
    return undefined;
  }

  const aggregateRows = (await query
    .clone()
    .clearSelect()
    .clearOrder()
    .select(aggregateSelects)) as GridRowModel[];
  return normalizeDataStudioDbRow(aggregateRows[0] ?? {});
}

function createKnexPivotAggregationSelects(
  knex: Knex,
  params: DataStudioGetRowsParams,
  pivotTuples: string[][],
  computedFields: DataStudioComputedFields | undefined,
) {
  const pivotColumnFields = getDataStudioPivotColumnFields(params.pivotModel);
  const pivotValues = getDataStudioPivotValues(params.pivotModel);
  const tuples = pivotColumnFields.length === 0 ? [[]] : pivotTuples;
  const selects: Record<string, Knex.Raw> = {};

  pivotValues.forEach(({ field, aggregationFunction }) => {
    tuples.forEach((tuple) => {
      const condition = createKnexCondition(
        knex,
        pivotColumnFields.map((pivotField, index) => ({
          field: pivotField,
          value: tuple[index],
        })),
        computedFields,
      );
      const outputField = getDataStudioPivotValueField(tuple, field);

      selects[outputField] = createKnexAggregationExpression(
        knex,
        field,
        aggregationFunction,
        computedFields,
        condition,
      );
    });
  });

  return selects;
}

async function getKnexPivotTuples(
  query: Knex.QueryBuilder,
  knex: Knex,
  params: DataStudioGetRowsParams,
  computedFields: DataStudioComputedFields | undefined,
) {
  const pivotColumnFields = getDataStudioPivotColumnFields(params.pivotModel);

  if (pivotColumnFields.length === 0) {
    return [];
  }

  const tupleQuery = query.clone().clearSelect().clearOrder();

  pivotColumnFields.forEach((field) => {
    const expression = getKnexComputedFieldExpression(knex, field, computedFields);
    tupleQuery.select({ [field]: expression }).groupBy(expression);
  });

  params.pivotModel?.columns.forEach((column) => {
    if (column.sort) {
      tupleQuery.orderBy(
        getKnexComputedFieldExpression(knex, column.field, computedFields),
        column.sort as 'asc' | 'desc',
      );
    }
  });

  const rows = (await tupleQuery) as GridRowModel[];
  return rows.map((row) => pivotColumnFields.map((field) => String(row[field] ?? '')));
}

function applyKnexNativeSort(
  query: Knex.QueryBuilder,
  params: DataStudioGetRowsParams,
  allowedFields: Set<string>,
  knex: Knex,
  computedFields: DataStudioComputedFields | undefined,
) {
  params.sortModel.forEach((sortItem) => {
    assertKnownField(sortItem.field, allowedFields);
    query.orderBy(
      getKnexComputedFieldExpression(knex, sortItem.field, computedFields),
      sortItem.sort ?? 'asc',
    );
  });
}

async function getKnexQueryCount(knex: Knex, query: Knex.QueryBuilder) {
  const countRows = await knex
    .count({ count: '*' })
    .from(query.clone().clearOrder().as('data_studio_count'));
  return parseCount(countRows[0] as Record<string, unknown>);
}

function withKnexPagination(query: Knex.QueryBuilder, params: DataStudioGetRowsParams) {
  const { offset, limit } = getPaginationRange(params);
  return query.offset(offset).limit(limit);
}

async function getKnexFlatRows(
  options: KnexDataStudioRowsOptions,
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  rowIdField: string | undefined,
  allowedFields: Set<string>,
) {
  const filteredQuery = createKnexFilteredQuery(options, params, columns, [], [], rowIdField);
  const rowCount = await getKnexQueryCount(options.knex, filteredQuery);
  const aggregateRow = await getKnexAggregateRow(
    filteredQuery,
    options.knex,
    params.aggregationModel,
    options.computedFields,
  );
  const rowsQuery = filteredQuery.clone().select('*');

  applyKnexComputedSelects(rowsQuery, options.knex, options.computedFields);
  applyKnexNativeSort(rowsQuery, params, allowedFields, options.knex, options.computedFields);

  return {
    rows: (await withKnexPagination(rowsQuery, params)).map(normalizeDataStudioDbRow),
    rowCount,
    ...(aggregateRow ? { aggregateRow } : {}),
  };
}

async function getKnexGroupedRows(
  options: KnexDataStudioRowsOptions,
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  rowIdField: string | undefined,
  allowedFields: Set<string>,
) {
  const groupFields = params.groupFields ?? [];
  const groupKeys = params.groupKeys ?? [];
  const currentGroupField = groupFields[groupKeys.length];
  const scopedQuery = createKnexFilteredQuery(
    options,
    params,
    columns,
    groupFields,
    groupKeys,
    rowIdField,
  );
  const aggregateRow = await getKnexAggregateRow(
    scopedQuery,
    options.knex,
    params.aggregationModel,
    options.computedFields,
  );

  if (!currentGroupField) {
    const rowCount = await getKnexQueryCount(options.knex, scopedQuery);
    const rowsQuery = scopedQuery.clone().select('*');

    applyKnexComputedSelects(rowsQuery, options.knex, options.computedFields);
    applyKnexNativeSort(rowsQuery, params, allowedFields, options.knex, options.computedFields);

    return {
      rows: hydrateDataStudioLeafRows(await withKnexPagination(rowsQuery, params), rowIdField),
      rowCount,
      ...(aggregateRow ? { aggregateRow } : {}),
    };
  }

  // Reuse the (binned or plain) group expression in SELECT + GROUP BY via raw SQL.
  // knex's object-`select`/`groupBy` mis-serialise complex reused expressions, so
  // derive the SQL string and use raw selects + `groupByRaw`.
  const groupDirective = params.binning?.[currentGroupField];
  let groupExpressionSql: string;
  if (groupDirective?.kind === 'numeric') {
    // Already a final SQL string (see `getKnexNumericBinExpression` — it must not
    // return a thenable `knex.raw` from an `async` function).
    groupExpressionSql = await getKnexNumericBinExpression(
      scopedQuery,
      options.knex,
      currentGroupField,
      options.computedFields,
      groupDirective.bins,
    );
  } else {
    const groupExpression = getKnexGroupExpression(
      options.knex,
      currentGroupField,
      options.computedFields,
      params.binning,
    );
    // A plain field name is quoted as an identifier; a `knex.raw` (date bin /
    // computed field) is stringified.
    groupExpressionSql =
      typeof groupExpression === 'string'
        ? quoteBinIdentifier(options.knex, groupExpression)
        : groupExpression.toString();
  }
  const groupQuery = scopedQuery
    .clone()
    .clearSelect()
    .clearOrder()
    .select(
      options.knex.raw(
        `${groupExpressionSql} as ${quoteBinIdentifier(options.knex, currentGroupField)}`,
      ),
    )
    .select(
      options.knex.raw(
        `${groupExpressionSql} as ${quoteBinIdentifier(options.knex, DATA_STUDIO_GROUP_KEY_FIELD)}`,
      ),
    )
    .count({ [DATA_STUDIO_CHILDREN_COUNT_FIELD]: '*' })
    .groupByRaw(groupExpressionSql);

  selectKnexExpressions(
    groupQuery,
    createKnexAggregationSelects(options.knex, params.aggregationModel, options.computedFields),
  );

  const rowCount = await getKnexQueryCount(options.knex, groupQuery);

  applyKnexNativeSort(groupQuery, params, allowedFields, options.knex, options.computedFields);

  return {
    rows: hydrateDataStudioGroupRows(
      await withKnexPagination(groupQuery, params),
      groupFields,
      groupKeys,
      rowIdField,
    ),
    rowCount,
    ...(aggregateRow ? { aggregateRow } : {}),
  };
}

function pivotKnexLeafRows(
  rows: GridRowModel[],
  params: DataStudioGetRowsParams,
  pivotTuples: string[][],
  rowIdField: string | undefined,
) {
  const pivotColumnFields = getDataStudioPivotColumnFields(params.pivotModel);
  const pivotValues = getDataStudioPivotValues(params.pivotModel);
  const pivotTupleLookup = new Set(pivotTuples.map((tuple) => JSON.stringify(tuple)));

  return hydrateDataStudioLeafRows(rows, rowIdField).map((row) => {
    const nextRow = { ...row };
    const tuple = pivotColumnFields.map((field) => String(row[field] ?? ''));

    pivotValues.forEach(({ field }) => {
      if (pivotColumnFields.length === 0 || pivotTupleLookup.has(JSON.stringify(tuple))) {
        nextRow[getDataStudioPivotValueField(tuple, field)] = row[field];
      }
    });

    return nextRow;
  });
}

async function getKnexPivotRows(
  options: KnexDataStudioRowsOptions,
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  rowIdField: string | undefined,
  allowedFields: Set<string>,
) {
  const rowFields = getDataStudioPivotRowFields(params.pivotModel);
  const groupKeys = params.groupKeys ?? [];
  const currentGroupField = rowFields[groupKeys.length];
  const scopedQuery = createKnexFilteredQuery(
    options,
    params,
    columns,
    rowFields,
    groupKeys,
    rowIdField,
  );
  const pivotTuples = await getKnexPivotTuples(
    scopedQuery,
    options.knex,
    params,
    options.computedFields,
  );
  const pivotColumns = buildDataStudioPivotColumnTree(pivotTuples);
  const aggregateRow = await getKnexAggregateRowFromSelects(
    scopedQuery,
    createKnexPivotAggregationSelects(options.knex, params, pivotTuples, options.computedFields),
  );

  if (rowFields.length === 0) {
    return {
      rows: [{ [rowIdField ?? 'id']: 'data-studio-pivot-root', ...(aggregateRow ?? {}) }],
      rowCount: 1,
      aggregateRow: aggregateRow ?? {},
      pivotColumns,
    };
  }

  if (!currentGroupField) {
    const rowCount = await getKnexQueryCount(options.knex, scopedQuery);
    const rowsQuery = scopedQuery.clone().select('*');

    applyKnexComputedSelects(rowsQuery, options.knex, options.computedFields);
    applyKnexNativeSort(rowsQuery, params, allowedFields, options.knex, options.computedFields);

    return {
      rows: pivotKnexLeafRows(
        await withKnexPagination(rowsQuery, params),
        params,
        pivotTuples,
        rowIdField,
      ),
      rowCount,
      aggregateRow: aggregateRow ?? {},
      pivotColumns,
    };
  }

  const groupExpression = getKnexGroupExpression(
    options.knex,
    currentGroupField,
    options.computedFields,
    params.binning,
  );
  const groupQuery = scopedQuery
    .clone()
    .clearSelect()
    .clearOrder()
    .select({
      [currentGroupField]: groupExpression,
      [DATA_STUDIO_GROUP_KEY_FIELD]: groupExpression,
    })
    .count({ [DATA_STUDIO_CHILDREN_COUNT_FIELD]: '*' })
    .groupBy(groupExpression);

  selectKnexExpressions(
    groupQuery,
    createKnexPivotAggregationSelects(options.knex, params, pivotTuples, options.computedFields),
  );

  const rowCount = await getKnexQueryCount(options.knex, groupQuery);

  applyKnexNativeSort(groupQuery, params, allowedFields, options.knex, options.computedFields);

  return {
    rows: hydrateDataStudioGroupRows(
      await withKnexPagination(groupQuery, params),
      rowFields,
      groupKeys,
      rowIdField,
    ),
    rowCount,
    aggregateRow: aggregateRow ?? {},
    pivotColumns,
  };
}

export function getKnexDataStudioRows(
  options: KnexDataStudioRowsOptions,
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  rowIdField: string | undefined,
) {
  const allowedFields = getKnexAllowedFields(columns, options.computedFields, rowIdField);

  if (params.pivotModel) {
    return getKnexPivotRows(options, params, columns, rowIdField, allowedFields);
  }

  if (params.groupFields?.length) {
    return getKnexGroupedRows(options, params, columns, rowIdField, allowedFields);
  }

  return getKnexFlatRows(options, params, columns, rowIdField, allowedFields);
}
