import type { GridValidRowModel } from '@mui/x-data-grid';
import type { DataStudioDataSource } from './DataStudio';
import type { DataStudioDataSourceDescriptor, DataStudioSchemaResponse } from './models';
import { DATA_STUDIO_SYNTHETIC_ID_FIELD } from './models';
import { createDataStudioDataSourceFromAPI } from './createDataStudioDataSourceFromAPI';

type DataStudioRemoteEndpointAction = 'rows' | 'createRow' | 'updateRow' | 'deleteRow';
type DataStudioRemoteEndpointResolver =
  | string
  | ((descriptor: DataStudioDataSourceDescriptor) => string);

export interface CreateDataStudioDataSourcesFromAPIOptions {
  /**
   * URL used to discover the Data Studio schema.
   */
  schemaUrl: string;
  /**
   * URL used to fetch rows. When not provided, it is derived from `schemaUrl`.
   */
  rowsUrl?: DataStudioRemoteEndpointResolver;
  /**
   * URL used to create rows. When not provided, it is derived from `schemaUrl` when enabled.
   */
  createRowUrl?: DataStudioRemoteEndpointResolver;
  /**
   * URL used to update rows. When not provided, it is derived from `schemaUrl` when enabled.
   */
  updateRowUrl?: DataStudioRemoteEndpointResolver;
  /**
   * URL used to delete rows. When not provided, it is derived from `schemaUrl` when enabled.
   */
  deleteRowUrl?: DataStudioRemoteEndpointResolver;
  /**
   * Fetch implementation used by the client helper.
   * @default fetch
   */
  fetch?: typeof fetch;
}

function getURL(url: string) {
  const base =
    typeof window === 'undefined' || !window.location?.origin
      ? 'http://localhost'
      : window.location.origin;

  return new URL(url, base);
}

function stringifyURL(url: URL, originalURL: string) {
  if (/^[a-z][a-z\d+\-.]*:/i.test(originalURL)) {
    return url.toString();
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

const endpointPathByAction: Record<DataStudioRemoteEndpointAction, string> = {
  rows: 'rows',
  createRow: 'create-row',
  updateRow: 'update-row',
  deleteRow: 'delete-row',
};

function deriveEndpointUrl(schemaUrl: string, action: DataStudioRemoteEndpointAction) {
  const url = getURL(schemaUrl);
  const pathAction = endpointPathByAction[action];

  if (url.pathname.endsWith('/schema')) {
    url.pathname = url.pathname.replace(/\/schema$/, `/${pathAction}`);
    return stringifyURL(url, schemaUrl);
  }

  if (url.searchParams.get('action') === 'schema') {
    url.searchParams.set('action', action);
    return stringifyURL(url, schemaUrl);
  }

  url.searchParams.set('action', action);
  return stringifyURL(url, schemaUrl);
}

function resolveEndpointUrl(
  descriptor: DataStudioDataSourceDescriptor,
  options: CreateDataStudioDataSourcesFromAPIOptions,
  action: DataStudioRemoteEndpointAction,
) {
  if (descriptor.endpoints?.[action]) {
    return descriptor.endpoints[action];
  }

  const resolver = options[`${action}Url`];

  if (typeof resolver === 'function') {
    return resolver(descriptor);
  }

  return resolver ?? deriveEndpointUrl(options.schemaUrl, action);
}

function getDataSourceLabel(descriptor: DataStudioDataSourceDescriptor) {
  return descriptor.label;
}

async function readRemoteErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { error?: unknown };

    return typeof body.error === 'string' ? body.error : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Loads a Data Studio schema and converts it into Data Studio dataSources.
 */
export async function createDataStudioDataSourcesFromAPI<R extends GridValidRowModel = any>(
  options: CreateDataStudioDataSourcesFromAPIOptions,
): Promise<DataStudioDataSource<R>[]> {
  const fetchFn = options.fetch ?? fetch;
  const response = await fetchFn(options.schemaUrl, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorMessage = await readRemoteErrorMessage(response);

    throw new Error(
      `MUI X Data Studio: The remote schema request failed with status ${response.status}.
This prevents Data Studio from discovering remote data sources.
Ensure the schema endpoint at "${options.schemaUrl}" returns a successful DataStudioSchemaResponse payload.${
        errorMessage ? `\nServer error: ${errorMessage}` : ''
      }`,
    );
  }

  const schema = (await response.json()) as DataStudioSchemaResponse<R>;

  return schema.dataSources.map((descriptor) => ({
    id: descriptor.id,
    label: getDataSourceLabel(descriptor),
    columns: descriptor.columns,
    rowIdField: descriptor.rowIdField,
    // Forward the server-declared chart grouping so server-backed charts can
    // aggregate by default (the server vouches it can group by these fields).
    ...(descriptor.chartDefaults ? { chartDefaults: descriptor.chartDefaults } : {}),
    // The connector groups + aggregates server-side → charts can summarize the
    // whole dataset instead of sampling.
    supportsServerGrouping:
      descriptor.capabilities.rowGrouping && descriptor.capabilities.aggregation,
    // Forward the join group so the UI can offer joins between same-backend sources.
    ...(descriptor.joinGroup ? { joinGroup: descriptor.joinGroup } : {}),
    // Prefer the synthetic id field for server-side group rows so the dataSource's
    // `rowIdField` column never displays values like `data-studio-group/...`.
    getRowId: descriptor.rowIdField
      ? (row) =>
          (row[DATA_STUDIO_SYNTHETIC_ID_FIELD as keyof typeof row] as any) ??
          row[descriptor.rowIdField as keyof typeof row]
      : (row) =>
          (row[DATA_STUDIO_SYNTHETIC_ID_FIELD as keyof typeof row] as any) ??
          (row as { id?: any }).id,
    connector: createDataStudioDataSourceFromAPI({
      dataSourceId: descriptor.id,
      rowsUrl: resolveEndpointUrl(descriptor, options, 'rows'),
      createRowUrl: descriptor.capabilities.createRow
        ? resolveEndpointUrl(descriptor, options, 'createRow')
        : undefined,
      updateRowUrl: descriptor.capabilities.updateRow
        ? resolveEndpointUrl(descriptor, options, 'updateRow')
        : undefined,
      deleteRowUrl: descriptor.capabilities.deleteRow
        ? resolveEndpointUrl(descriptor, options, 'deleteRow')
        : undefined,
      accessors: descriptor.accessors,
      fetch: fetchFn,
    }),
  }));
}
