import * as React from 'react';
import { getGridDefaultColumnTypes, GridRowModel } from '@mui/x-data-grid-pro';
import { isDeepEqual } from '@mui/x-data-grid/internals';
import {
  useDemoData,
  UseDemoDataOptions,
  getColumnsFromOptions,
  getInitialState,
} from './useDemoData';
import { DEFAULT_DATASET_OPTIONS, DEFAULT_SERVER_OPTIONS, loadServerRows } from './serverUtils';
import type { ServerOptions, QueryOptions, PageInfo } from './serverUtils';

export const createFakeServer = (
  dataSetOptions?: Partial<UseDemoDataOptions>,
  serverOptions?: ServerOptions,
) => {
  const dataSetOptionsWithDefault = { ...DEFAULT_DATASET_OPTIONS, ...dataSetOptions };
  const serverOptionsWithDefault = { ...DEFAULT_SERVER_OPTIONS, ...serverOptions };

  const columns = getColumnsFromOptions(dataSetOptionsWithDefault);
  const initialState = getInitialState(dataSetOptionsWithDefault, columns);

  const defaultColDef = getGridDefaultColumnTypes();
  const columnsWithDefaultColDef = columns.map((column) => ({
    ...defaultColDef[column.type || 'string'],
    ...column,
  }));

  const useQuery = (queryOptions: QueryOptions) => {
    const {
      data: { rows },
      loading: dataGenerationIsLoading,
    } = useDemoData(dataSetOptionsWithDefault);

    const queryOptionsRef = React.useRef(queryOptions);
    const [response, setResponse] = React.useState<{
      pageInfo: PageInfo;
      rows: GridRowModel[];
    }>({ pageInfo: {}, rows: [] });
    const [isLoading, setIsLoading] = React.useState<boolean>(dataGenerationIsLoading);

    React.useEffect(() => {
      if (dataGenerationIsLoading) {
        // dataset is not ready
        return () => {};
      }

      queryOptionsRef.current = queryOptions;
      let active = true;

      setIsLoading(true);
      setResponse((prev) =>
        Object.keys(prev.pageInfo).length === 0 ? prev : { ...prev, pageInfo: {} },
      );

      (async function fetchData() {
        const { returnedRows, nextCursor, totalRowCount, hasNextPage } = await loadServerRows(
          rows,
          queryOptions,
          serverOptionsWithDefault,
          columnsWithDefaultColDef,
        );
        if (!active) {
          return;
        }
        const newRep = {
          rows: returnedRows,
          pageInfo: {
            totalRowCount,
            nextCursor,
            hasNextPage,
            pageSize: returnedRows.length,
          },
        };
        setResponse((prev) => (isDeepEqual(prev, newRep) ? prev : newRep));
        setIsLoading(false);
      })();

      return () => {
        active = false;
      };
    }, [dataGenerationIsLoading, queryOptions, rows]);

    // We use queryOptions pointer to be sure that isLoading===true as soon as the options change
    const effectShouldStart = queryOptionsRef.current !== queryOptions;

    return {
      isLoading: isLoading || effectShouldStart,
      ...response,
    };
  };

  return { columns, columnsWithDefaultColDef, initialState, useQuery };
};
