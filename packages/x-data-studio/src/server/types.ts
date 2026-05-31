import type {
  GridRowId,
  GridRowModel,
  GridUpdateRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid';
import type { Knex } from 'knex';
import type {
  DataStudioDataSourceCapabilities,
  DataStudioDataSourceDescriptor,
  DataStudioEndpointAction,
  DataStudioGetRowsParams,
  DataStudioGetRowsResponse,
  DataStudioRowMutationAction,
  DataStudioSchemaResponse,
} from '../models';

export type DataStudioRequestContext = Record<string, unknown>;

export interface DataStudioCreateRowParams {
  row: GridRowModel;
}

export interface DataStudioDeleteRowParams {
  rowId: GridRowId;
  row?: GridRowModel;
}

export type DataStudioMutationOptions =
  | boolean
  | Partial<Record<DataStudioRowMutationAction, boolean>>;

export interface DataStudioSourceHookParams<
  TPayload = unknown,
  TResult = unknown,
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> {
  operation: DataStudioRowMutationAction;
  dataSourceId: string;
  context: TContext;
  payload: TPayload;
  result?: TResult;
}

export interface DataStudioSourceHooks<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> {
  onBefore?: <TPayload>(
    params: DataStudioSourceHookParams<TPayload, unknown, TContext>,
  ) => Promise<TPayload | void> | TPayload | void;
  onAfter?: <TPayload, TResult>(
    params: DataStudioSourceHookParams<TPayload, TResult, TContext>,
  ) => Promise<TResult | void> | TResult | void;
}

export interface DataStudioServerDataSource<
  R extends GridValidRowModel = any,
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> {
  id: string;
  getSchema(): Promise<DataStudioDataSourceDescriptor<R>> | DataStudioDataSourceDescriptor<R>;
  getRows(params: DataStudioGetRowsParams): Promise<DataStudioGetRowsResponse>;
  createRow?(params: DataStudioCreateRowParams, context: TContext): Promise<GridRowModel>;
  updateRow?(params: GridUpdateRowParams, context: TContext): Promise<GridRowModel>;
  deleteRow?(params: DataStudioDeleteRowParams, context: TContext): Promise<GridRowModel>;
  destroy?(): Promise<void> | void;
}

export interface DataStudioRequestLifecycleParams<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> {
  operation: DataStudioEndpointAction;
  request: DataStudioEndpointRequest;
  context: TContext;
  dataSourceId?: string;
  body?: unknown;
}

export interface DataStudioRequestAfterLifecycleParams<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> extends DataStudioRequestLifecycleParams<TContext> {
  result?: unknown;
  error?: unknown;
}

export interface DataStudioServer<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> {
  createContext(request: DataStudioEndpointRequest): Promise<TContext>;
  runRequest<T>(
    params: Omit<DataStudioRequestLifecycleParams<TContext>, 'context'>,
    handler: (context: TContext) => Promise<T>,
  ): Promise<T>;
  getSchema(context?: TContext): Promise<DataStudioSchemaResponse>;
  getRows(
    dataSourceId: string,
    params: DataStudioGetRowsParams,
    context?: TContext,
  ): Promise<DataStudioGetRowsResponse>;
  createRow(
    dataSourceId: string,
    params: DataStudioCreateRowParams,
    context: TContext,
  ): Promise<GridRowModel>;
  updateRow(
    dataSourceId: string,
    params: GridUpdateRowParams,
    context: TContext,
  ): Promise<GridRowModel>;
  deleteRow(
    dataSourceId: string,
    params: DataStudioDeleteRowParams,
    context: TContext,
  ): Promise<GridRowModel>;
}

export interface CreateDataStudioServerOptions<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> {
  dataSources: DataStudioServerDataSource<any, TContext>[];
  createContext?: (request: DataStudioEndpointRequest) => Promise<TContext> | TContext;
  onBeforeRequest?: (params: DataStudioRequestLifecycleParams<TContext>) => Promise<void> | void;
  onAfterRequest?: (
    params: DataStudioRequestAfterLifecycleParams<TContext>,
  ) => Promise<void> | void;
}

export type DataStudioSchemaMode = 'strict' | 'auto';

export interface DataStudioComputedField<R extends GridValidRowModel = any> {
  /**
   * Computes a field value for in-memory data sources.
   * @param {R} row Row used to compute the field value.
   * @returns {unknown} Computed field value.
   */
  valueGetter?: (row: R) => unknown;
  /**
   * Computes a field value in Knex-backed SQL data sources.
   * @param {Knex} knex Knex instance used to build the SQL expression.
   * @returns {Knex.Raw | Knex.QueryBuilder | string} SQL expression for the computed field.
   */
  knex?: (knex: Knex) => Knex.Raw | Knex.QueryBuilder | string;
  /**
   * Computes a field value in MongoDB data sources through a $addFields expression.
   */
  mongo?: unknown;
}

export type DataStudioComputedFields<R extends GridValidRowModel = any> = Record<
  string,
  DataStudioComputedField<R>
>;

export interface DataStudioSourceSchema<R extends GridValidRowModel = any> {
  label?: string;
  columns?: DataStudioDataSourceDescriptor<R>['columns'];
  rowIdField?: string;
  capabilities?: Partial<DataStudioDataSourceCapabilities>;
  accessors?: DataStudioDataSourceDescriptor<R>['accessors'];
  endpoints?: DataStudioDataSourceDescriptor<R>['endpoints'];
  meta?: Record<string, unknown>;
}

export interface DataStudioSourceBaseOptions<
  R extends GridValidRowModel = any,
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> {
  id: string;
  label?: string;
  mode?: DataStudioSchemaMode;
  schema?: DataStudioSourceSchema<R>;
  columns?: DataStudioDataSourceDescriptor<R>['columns'];
  rowIdField?: string;
  hiddenFields?: string[];
  accessors?: DataStudioDataSourceDescriptor<R>['accessors'];
  computedFields?: DataStudioComputedFields<R>;
  mutations?: DataStudioMutationOptions;
  hooks?: DataStudioSourceHooks<TContext>;
  /**
   * Opaque token shared by sources that can be joined together (e.g. all tables
   * on one SQL connection). Surfaced on the descriptor so the join builder only
   * offers joins between same-group sources.
   */
  joinGroup?: string;
}

export interface DataStudioEndpointRequest {
  method?: string;
  url?: string;
  action?: DataStudioEndpointAction;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
  json?: () => Promise<unknown>;
}

export interface DataStudioEndpointResponse {
  status: number;
  headers: Record<string, string>;
  body: unknown;
}

export interface DataStudioMongoCollectionLike {
  find(
    filter: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): {
    sort?: (sort: Record<string, 1 | -1>) => {
      skip?: (count: number) => {
        limit?: (count: number) => { toArray(): Promise<GridRowModel[]> };
        toArray(): Promise<GridRowModel[]>;
      };
      limit?: (count: number) => { toArray(): Promise<GridRowModel[]> };
      toArray(): Promise<GridRowModel[]>;
    };
    skip?: (count: number) => {
      limit?: (count: number) => { toArray(): Promise<GridRowModel[]> };
      toArray(): Promise<GridRowModel[]>;
    };
    limit?: (count: number) => { toArray(): Promise<GridRowModel[]> };
    toArray(): Promise<GridRowModel[]>;
  };
  countDocuments(filter: Record<string, unknown>): Promise<number>;
  findOne?(filter?: Record<string, unknown>): Promise<GridRowModel | null>;
  aggregate?(pipeline: Record<string, unknown>[]): { toArray(): Promise<GridRowModel[]> };
  insertOne?(document: GridRowModel): Promise<{ insertedId?: unknown }>;
  updateOne?(
    filter: Record<string, unknown>,
    update: Record<string, unknown>,
  ): Promise<{ matchedCount?: number; modifiedCount?: number }>;
  deleteOne?(filter: Record<string, unknown>): Promise<{ deletedCount?: number }>;
}
