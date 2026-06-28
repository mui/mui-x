import type { GridColDef, GridRowModel } from '@mui/x-data-grid';
import { GridLogicOperator } from '@mui/x-data-grid';
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
import type { DataStudioComputedFields, DataStudioMongoCollectionLike } from './types';
import { assertKnownField, getAllowedFields, getPaginationRange } from './utils';

type MongoFilter = Record<string, unknown>;

interface MongoDataStudioRowsOptions {
  id: string;
  collection: DataStudioMongoCollectionLike;
  computedFields?: DataStudioComputedFields;
}

function escapeRegExp(value: unknown) {
  return String(value ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeArray(value: unknown) {
  return Array.isArray(value) ? value : [value];
}

function createMongoFilterForItem(field: string, operator: string, value: unknown): MongoFilter {
  switch (operator) {
    case 'contains':
      return { [field]: { $regex: escapeRegExp(value), $options: 'i' } };
    case 'doesNotContain':
      return { [field]: { $not: { $regex: escapeRegExp(value), $options: 'i' } } };
    case 'equals':
    case '=':
      return { [field]: value };
    case 'doesNotEqual':
    case '!=':
      return { [field]: { $ne: value } };
    case 'startsWith':
      return { [field]: { $regex: `^${escapeRegExp(value)}`, $options: 'i' } };
    case 'endsWith':
      return { [field]: { $regex: `${escapeRegExp(value)}$`, $options: 'i' } };
    case 'isEmpty':
      return { $or: [{ [field]: null }, { [field]: '' }] };
    case 'isNotEmpty':
      return { [field]: { $nin: [null, ''] } };
    case 'isAnyOf':
      return { [field]: { $in: normalizeArray(value) } };
    case '>':
      return { [field]: { $gt: value } };
    case '>=':
      return { [field]: { $gte: value } };
    case '<':
      return { [field]: { $lt: value } };
    case '<=':
      return { [field]: { $lte: value } };
    default:
      throw new DataStudioServerError(
        `MUI X Data Studio: Unsupported filter operator "${operator}".
This prevents Data Studio from translating the request to MongoDB.
Use a supported Data Grid filter operator or extend the MongoDB data source.`,
      );
  }
}

function createMongoFilter(
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  computedFields?: DataStudioComputedFields,
  rowIdField?: string,
) {
  const allowedFields = new Set([
    ...getAllowedFields(columns, rowIdField),
    ...getComputedFieldNames(computedFields),
  ]);
  const filterItems = params.filterModel.items ?? [];
  const filters: MongoFilter[] = filterItems.map((item) => {
    assertKnownField(item.field, allowedFields);
    return createMongoFilterForItem(item.field, item.operator, item.value);
  });

  if (params.filterModel.quickFilterValues?.length) {
    const searchableFields = columns.map((column) => column.field);
    const quickFilters: MongoFilter[] = params.filterModel.quickFilterValues.map((value) => ({
      $or: searchableFields.map((field) => ({
        [field]: { $regex: escapeRegExp(value), $options: 'i' },
      })),
    }));

    filters.push(
      params.filterModel.quickFilterLogicOperator === GridLogicOperator.Or
        ? { $or: quickFilters }
        : { $and: quickFilters },
    );
  }

  if (filters.length === 0) {
    return {};
  }

  return (params.filterModel.logicOperator ?? GridLogicOperator.And) === GridLogicOperator.Or
    ? { $or: filters }
    : { $and: filters };
}

function createMongoAddFieldsStage(computedFields: DataStudioComputedFields | undefined) {
  const fields = Object.fromEntries(
    Object.entries(computedFields ?? {})
      .filter(([, computedField]) => typeof computedField.mongo !== 'undefined')
      .map(([field, computedField]) => [field, computedField.mongo]),
  );

  return Object.keys(fields).length > 0 ? { $addFields: fields } : null;
}

function createMongoSort(
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  computedFields: DataStudioComputedFields | undefined,
  rowIdField?: string,
  extraFields: string[] = [],
) {
  const allowedFields = new Set([
    ...getAllowedFields(columns, rowIdField),
    ...getComputedFieldNames(computedFields),
    ...extraFields,
    DATA_STUDIO_GROUP_KEY_FIELD,
    DATA_STUDIO_CHILDREN_COUNT_FIELD,
    DATA_STUDIO_SYNTHETIC_ID_FIELD,
  ]);

  return Object.fromEntries(
    params.sortModel.map((sortItem) => {
      assertKnownField(sortItem.field, allowedFields);
      return [sortItem.field, sortItem.sort === 'desc' ? -1 : 1];
    }),
  ) as Record<string, 1 | -1>;
}

function hasMongoStageKeys(stage: Record<string, unknown>) {
  return Object.keys(stage).length > 0;
}

function createMongoBasePipeline(
  filter: MongoFilter,
  addFieldsStage: Record<string, unknown> | null,
  groupFields: string[] = [],
  groupKeys: string[] = [],
) {
  const groupScopeFilter = Object.fromEntries(
    groupKeys.map((groupKey, index) => [groupFields[index], groupKey]),
  );

  return [
    ...(addFieldsStage ? [addFieldsStage] : []),
    ...(hasMongoStageKeys(filter) ? [{ $match: filter }] : []),
    ...(hasMongoStageKeys(groupScopeFilter) ? [{ $match: groupScopeFilter }] : []),
  ];
}

function appendMongoSortAndPagination(
  pipeline: Record<string, unknown>[],
  sort: Record<string, 1 | -1>,
  params: DataStudioGetRowsParams,
) {
  const { offset, limit } = getPaginationRange(params);

  return [
    ...pipeline,
    ...(hasMongoStageKeys(sort) ? [{ $sort: sort }] : []),
    ...(offset > 0 ? [{ $skip: offset }] : []),
    ...(limit > 0 ? [{ $limit: limit }] : []),
  ];
}

function createMongoCondition(conditions: Array<{ field: string; value: string }>) {
  if (conditions.length === 0) {
    return undefined;
  }

  const expressions = conditions.map(({ field, value }) => ({ $eq: [`$${field}`, value] }));
  return expressions.length === 1 ? expressions[0] : { $and: expressions };
}

function createMongoAggregationExpression(
  field: string,
  aggregationFunction: string,
  condition?: Record<string, unknown>,
) {
  const normalizedAggregationFunction = getDataStudioAggregationFunction(aggregationFunction);

  const fieldExpression = `$${field}`;

  switch (normalizedAggregationFunction) {
    case 'sum':
      return {
        $sum: condition ? { $cond: [condition, fieldExpression, 0] } : fieldExpression,
      };
    case 'avg':
      return {
        $avg: condition ? { $cond: [condition, fieldExpression, null] } : fieldExpression,
      };
    case 'min':
      return {
        $min: condition ? { $cond: [condition, fieldExpression, null] } : fieldExpression,
      };
    case 'max':
      return {
        $max: condition ? { $cond: [condition, fieldExpression, null] } : fieldExpression,
      };
    case 'size':
      return {
        $sum: condition ? { $cond: [condition, 1, 0] } : 1,
      };
    case 'sizeTrue': {
      const truthyExpression = { $eq: [fieldExpression, true] };
      return {
        $sum: {
          $cond: [condition ? { $and: [condition, truthyExpression] } : truthyExpression, 1, 0],
        },
      };
    }
    case 'sizeFalse': {
      const falseExpression = { $eq: [fieldExpression, false] };
      return {
        $sum: {
          $cond: [condition ? { $and: [condition, falseExpression] } : falseExpression, 1, 0],
        },
      };
    }
    default:
      throw /* minify-error-disabled */ new Error('MUI X: Unreachable');
  }
}

function createMongoAggregationFields(aggregationModel: Record<string, string> | undefined) {
  return Object.fromEntries(
    Object.entries(aggregationModel ?? {}).map(([field, aggregationFunction]) => [
      field,
      createMongoAggregationExpression(field, aggregationFunction),
    ]),
  );
}

function createMongoPivotAggregationFields(
  params: DataStudioGetRowsParams,
  pivotTuples: string[][],
) {
  const pivotColumnFields = getDataStudioPivotColumnFields(params.pivotModel);
  const pivotValues = getDataStudioPivotValues(params.pivotModel);
  const tuples = pivotColumnFields.length === 0 ? [[]] : pivotTuples;
  const fields: Record<string, unknown> = {};

  pivotValues.forEach(({ field, aggregationFunction }) => {
    tuples.forEach((tuple) => {
      const condition = createMongoCondition(
        pivotColumnFields.map((pivotField, index) => ({
          field: pivotField,
          value: tuple[index],
        })),
      );
      const outputField = getDataStudioPivotValueField(tuple, field);

      fields[outputField] = createMongoAggregationExpression(field, aggregationFunction, condition);
    });
  });

  return fields;
}

function getMongoAggregate(collection: DataStudioMongoCollectionLike, dataSourceId: string) {
  const aggregate = collection.aggregate;

  if (!aggregate) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The MongoDB collection for data source "${dataSourceId}" does not implement aggregate().
This prevents the MongoDB adapter from computing server-side computed, grouped, aggregated, or pivoted rows.
Pass a collection object that supports aggregate() before requesting these features.`,
    );
  }

  return aggregate;
}

async function runMongoPipeline(
  collection: DataStudioMongoCollectionLike,
  dataSourceId: string,
  pipeline: Record<string, unknown>[],
) {
  const aggregate = getMongoAggregate(collection, dataSourceId);
  return aggregate.call(collection, pipeline).toArray();
}

async function getMongoPipelineCount(
  collection: DataStudioMongoCollectionLike,
  dataSourceId: string,
  pipeline: Record<string, unknown>[],
) {
  const countRows = await runMongoPipeline(collection, dataSourceId, [
    ...pipeline,
    { $count: 'count' },
  ]);

  return Number(countRows[0]?.count ?? 0);
}

async function getMongoAggregateRowFromFields(
  collection: DataStudioMongoCollectionLike,
  dataSourceId: string,
  pipeline: Record<string, unknown>[],
  fields: Record<string, unknown>,
) {
  if (!hasMongoStageKeys(fields)) {
    return undefined;
  }

  const aggregateRows = await runMongoPipeline(collection, dataSourceId, [
    ...pipeline,
    {
      $group: {
        _id: null,
        ...fields,
      },
    },
    { $project: { _id: 0 } },
  ]);

  return normalizeDataStudioDbRow((aggregateRows[0] ?? {}) as GridRowModel);
}

async function getMongoAggregateRow(
  collection: DataStudioMongoCollectionLike,
  dataSourceId: string,
  pipeline: Record<string, unknown>[],
  aggregationModel: Record<string, string> | undefined,
) {
  return getMongoAggregateRowFromFields(
    collection,
    dataSourceId,
    pipeline,
    createMongoAggregationFields(aggregationModel),
  );
}

async function getMongoFlatRows(
  options: MongoDataStudioRowsOptions,
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  rowIdField: string | undefined,
  filter: MongoFilter,
  addFieldsStage: Record<string, unknown> | null,
) {
  const sort = createMongoSort(params, columns, options.computedFields, rowIdField);
  const basePipeline = createMongoBasePipeline(filter, addFieldsStage);
  const rowCount = await getMongoPipelineCount(options.collection, options.id, basePipeline);
  const aggregateRow = await getMongoAggregateRow(
    options.collection,
    options.id,
    basePipeline,
    params.aggregationModel,
  );
  const rows = await runMongoPipeline(
    options.collection,
    options.id,
    appendMongoSortAndPagination(basePipeline, sort, params),
  );

  return {
    rows: rows.map((row) => normalizeDataStudioDbRow(row as GridRowModel)),
    rowCount,
    ...(aggregateRow ? { aggregateRow } : {}),
  };
}

async function getMongoGroupedRows(
  options: MongoDataStudioRowsOptions,
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  rowIdField: string | undefined,
  filter: MongoFilter,
  addFieldsStage: Record<string, unknown> | null,
) {
  const groupFields = params.groupFields ?? [];
  const groupKeys = params.groupKeys ?? [];
  const currentGroupField = groupFields[groupKeys.length];
  const basePipeline = createMongoBasePipeline(filter, addFieldsStage, groupFields, groupKeys);
  const aggregateRow = await getMongoAggregateRow(
    options.collection,
    options.id,
    basePipeline,
    params.aggregationModel,
  );

  if (!currentGroupField) {
    const sort = createMongoSort(params, columns, options.computedFields, rowIdField);
    const rowCount = await getMongoPipelineCount(options.collection, options.id, basePipeline);
    const rows = await runMongoPipeline(
      options.collection,
      options.id,
      appendMongoSortAndPagination(basePipeline, sort, params),
    );

    return {
      rows: hydrateDataStudioLeafRows(rows as GridRowModel[], rowIdField),
      rowCount,
      ...(aggregateRow ? { aggregateRow } : {}),
    };
  }

  const groupPipeline = [
    ...basePipeline,
    {
      $group: {
        _id: `$${currentGroupField}`,
        [currentGroupField]: { $first: `$${currentGroupField}` },
        [DATA_STUDIO_GROUP_KEY_FIELD]: { $first: `$${currentGroupField}` },
        [DATA_STUDIO_CHILDREN_COUNT_FIELD]: { $sum: 1 },
        ...createMongoAggregationFields(params.aggregationModel),
      },
    },
    { $project: { _id: 0 } },
  ];
  const sort = createMongoSort(params, columns, options.computedFields, rowIdField);
  const rowCount = await getMongoPipelineCount(options.collection, options.id, groupPipeline);
  const rows = await runMongoPipeline(
    options.collection,
    options.id,
    appendMongoSortAndPagination(groupPipeline, sort, params),
  );

  return {
    rows: hydrateDataStudioGroupRows(rows as GridRowModel[], groupFields, groupKeys, rowIdField),
    rowCount,
    ...(aggregateRow ? { aggregateRow } : {}),
  };
}

async function getMongoPivotTuples(
  collection: DataStudioMongoCollectionLike,
  dataSourceId: string,
  pipeline: Record<string, unknown>[],
  params: DataStudioGetRowsParams,
) {
  const pivotColumnFields = getDataStudioPivotColumnFields(params.pivotModel);

  if (pivotColumnFields.length === 0) {
    return [];
  }

  const rows = await runMongoPipeline(collection, dataSourceId, [
    ...pipeline,
    {
      $group: {
        _id: Object.fromEntries(pivotColumnFields.map((field) => [field, `$${field}`])),
        ...Object.fromEntries(pivotColumnFields.map((field) => [field, { $first: `$${field}` }])),
      },
    },
    { $project: { _id: 0 } },
    ...((params.pivotModel?.columns ?? []).some((column) => column.sort)
      ? [
          {
            $sort: Object.fromEntries(
              (params.pivotModel?.columns ?? [])
                .filter((column) => column.sort)
                .map((column) => [column.field, column.sort === 'desc' ? -1 : 1]),
            ),
          },
        ]
      : []),
  ]);

  return rows.map((row) => pivotColumnFields.map((field) => String(row[field] ?? '')));
}

function pivotMongoLeafRows(
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

async function getMongoPivotRows(
  options: MongoDataStudioRowsOptions,
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  rowIdField: string | undefined,
  filter: MongoFilter,
  addFieldsStage: Record<string, unknown> | null,
) {
  const rowFields = getDataStudioPivotRowFields(params.pivotModel);
  const groupKeys = params.groupKeys ?? [];
  const currentGroupField = rowFields[groupKeys.length];
  const basePipeline = createMongoBasePipeline(filter, addFieldsStage, rowFields, groupKeys);
  const pivotTuples = await getMongoPivotTuples(
    options.collection,
    options.id,
    basePipeline,
    params,
  );
  const pivotColumns = buildDataStudioPivotColumnTree(pivotTuples);
  const pivotAggregationFields = createMongoPivotAggregationFields(params, pivotTuples);
  const aggregateRow = await getMongoAggregateRowFromFields(
    options.collection,
    options.id,
    basePipeline,
    pivotAggregationFields,
  );
  const pivotOutputFields = Object.keys(pivotAggregationFields);

  if (rowFields.length === 0) {
    return {
      rows: [{ [rowIdField ?? 'id']: 'data-studio-pivot-root', ...(aggregateRow ?? {}) }],
      rowCount: 1,
      aggregateRow: aggregateRow ?? {},
      pivotColumns,
    };
  }

  if (!currentGroupField) {
    const sort = createMongoSort(
      params,
      columns,
      options.computedFields,
      rowIdField,
      pivotOutputFields,
    );
    const rowCount = await getMongoPipelineCount(options.collection, options.id, basePipeline);
    const rows = await runMongoPipeline(
      options.collection,
      options.id,
      appendMongoSortAndPagination(basePipeline, sort, params),
    );

    return {
      rows: pivotMongoLeafRows(rows as GridRowModel[], params, pivotTuples, rowIdField),
      rowCount,
      aggregateRow: aggregateRow ?? {},
      pivotColumns,
    };
  }

  const groupPipeline = [
    ...basePipeline,
    {
      $group: {
        _id: `$${currentGroupField}`,
        [currentGroupField]: { $first: `$${currentGroupField}` },
        [DATA_STUDIO_GROUP_KEY_FIELD]: { $first: `$${currentGroupField}` },
        [DATA_STUDIO_CHILDREN_COUNT_FIELD]: { $sum: 1 },
        ...pivotAggregationFields,
      },
    },
    { $project: { _id: 0 } },
  ];
  const sort = createMongoSort(
    params,
    columns,
    options.computedFields,
    rowIdField,
    pivotOutputFields,
  );
  const rowCount = await getMongoPipelineCount(options.collection, options.id, groupPipeline);
  const rows = await runMongoPipeline(
    options.collection,
    options.id,
    appendMongoSortAndPagination(groupPipeline, sort, params),
  );

  return {
    rows: hydrateDataStudioGroupRows(rows as GridRowModel[], rowFields, groupKeys, rowIdField),
    rowCount,
    aggregateRow: aggregateRow ?? {},
    pivotColumns,
  };
}

export async function getMongoDataStudioRows(
  options: MongoDataStudioRowsOptions,
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  rowIdField: string | undefined,
) {
  const filter = createMongoFilter(params, columns, options.computedFields, rowIdField);
  const { offset, limit } = getPaginationRange(params);
  const addFieldsStage = createMongoAddFieldsStage(options.computedFields);

  if (params.pivotModel) {
    return getMongoPivotRows(options, params, columns, rowIdField, filter, addFieldsStage);
  }

  if (params.groupFields?.length) {
    return getMongoGroupedRows(options, params, columns, rowIdField, filter, addFieldsStage);
  }

  if (addFieldsStage || Object.keys(params.aggregationModel ?? {}).length > 0) {
    return getMongoFlatRows(options, params, columns, rowIdField, filter, addFieldsStage);
  }

  const sort = createMongoSort(params, columns, options.computedFields, rowIdField);
  let cursor = options.collection.find(filter);

  if (Object.keys(sort).length > 0 && cursor.sort) {
    cursor = cursor.sort(sort);
  }

  if (cursor.skip) {
    cursor = cursor.skip(offset);
  }

  if (cursor.limit) {
    cursor = cursor.limit(limit);
  }

  return {
    rows: await cursor.toArray(),
    rowCount: await options.collection.countDocuments(filter),
  };
}
