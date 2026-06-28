import type { GridUpdateRowParams } from '@mui/x-data-grid';
import {
  DATA_STUDIO_PROTOCOL_VERSION,
  type DataStudioRowMutationAction,
  type DataStudioSchemaResponse,
} from '../models';
import { DataStudioServerError } from './errors';
import type {
  CreateDataStudioServerOptions,
  DataStudioCreateRowParams,
  DataStudioDeleteRowParams,
  DataStudioRequestContext,
  DataStudioServer,
  DataStudioServerDataSource,
} from './types';

function createDataSourceLookup(dataSources: DataStudioServerDataSource[]) {
  const lookup = new Map<string, DataStudioServerDataSource<any, any>>();

  dataSources.forEach((dataSource) => {
    if (lookup.has(dataSource.id)) {
      throw new DataStudioServerError(
        `MUI X Data Studio: Duplicate data source id "${dataSource.id}".
This prevents the Data Studio server from routing row requests reliably.
Ensure every server data source has a unique id.`,
      );
    }

    lookup.set(dataSource.id, dataSource);
  });

  return lookup;
}

function getDataSource(
  dataSourceLookup: Map<string, DataStudioServerDataSource<any, any>>,
  dataSourceId: string,
) {
  const dataSource = dataSourceLookup.get(dataSourceId);

  if (!dataSource) {
    throw new DataStudioServerError(
      `MUI X Data Studio: Unknown data source "${dataSourceId}".
This prevents the Data Studio server from routing the row request.
Ensure the client uses a data source id returned by the schema endpoint.`,
    );
  }

  return dataSource;
}

function assertMutationHandler(
  dataSource: DataStudioServerDataSource<any, any>,
  operation: DataStudioRowMutationAction,
): never {
  throw new DataStudioServerError(
    `MUI X Data Studio: The "${operation}" operation is disabled for data source "${dataSource.id}".
This prevents the Data Studio server from mutating rows unexpectedly.
Enable the operation in the data source mutations option before calling it.`,
    405,
  );
}

export function createDataStudioServer<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
>(options: CreateDataStudioServerOptions<TContext>): DataStudioServer<TContext> {
  const dataSourceLookup = createDataSourceLookup(options.dataSources);

  return {
    async createContext(request) {
      return options.createContext?.(request) ?? ({} as TContext);
    },

    async runRequest(params, handler) {
      const context = await this.createContext(params.request);
      const lifecycleParams = {
        ...params,
        context,
      };

      try {
        await options.onBeforeRequest?.(lifecycleParams);
        const result = await handler(context);
        await options.onAfterRequest?.({ ...lifecycleParams, result });
        return result;
      } catch (error) {
        await options.onAfterRequest?.({ ...lifecycleParams, error });
        throw error;
      }
    },

    async getSchema(): Promise<DataStudioSchemaResponse> {
      return {
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSources: await Promise.all(
          options.dataSources.map((dataSource) => dataSource.getSchema()),
        ),
      };
    },

    async getRows(dataSourceId, params) {
      return getDataSource(dataSourceLookup, dataSourceId).getRows(params);
    },

    async createRow(dataSourceId: string, params: DataStudioCreateRowParams, context: TContext) {
      const dataSource = getDataSource(dataSourceLookup, dataSourceId);
      return (
        dataSource.createRow?.(params, context) ?? assertMutationHandler(dataSource, 'createRow')
      );
    },

    async updateRow(dataSourceId: string, params: GridUpdateRowParams, context: TContext) {
      const dataSource = getDataSource(dataSourceLookup, dataSourceId);
      return (
        dataSource.updateRow?.(params, context) ?? assertMutationHandler(dataSource, 'updateRow')
      );
    },

    async deleteRow(dataSourceId: string, params: DataStudioDeleteRowParams, context: TContext) {
      const dataSource = getDataSource(dataSourceLookup, dataSourceId);
      return (
        dataSource.deleteRow?.(params, context) ?? assertMutationHandler(dataSource, 'deleteRow')
      );
    },
  };
}
