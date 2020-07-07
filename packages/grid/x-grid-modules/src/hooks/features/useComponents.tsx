import * as React from 'react';
import { useMemo } from 'react';
import { PaginationProps } from './usePagination';
import {
  ComponentParams,
  GridApiRef,
  GridOptions,
  GridRootRef,
  InternalColumns,
  Rows,
} from '../../models';
import { LoadingOverlay, NoRowMessage } from '../../components';

export const useComponents = (
  columns: InternalColumns,
  rows: Rows,
  options: GridOptions,
  paginationProps: PaginationProps,
  apiRef: GridApiRef,
  gridRootRef: GridRootRef,
) => {
  const componentParams: ComponentParams = useMemo(
    () => ({
      paginationProps,
      rows: rows,
      columns: columns.visible,
      options: options,
      api: apiRef,
      rootElement: gridRootRef,
    }),
    [paginationProps, rows, columns, options, apiRef, gridRootRef],
  );

  const headerComponent = useMemo(
    () => (options.headerComponent ? options.headerComponent(componentParams) : null),
    [options, componentParams],
  );
  const footerComponent = useMemo(
    () => (options.footerComponent ? options.footerComponent(componentParams) : null),
    [options, componentParams],
  );

  const loadingComponent = useMemo(
    () => (options.loadingOverlayComponent ? options.loadingOverlayComponent : <LoadingOverlay />),
    [options.loadingOverlayComponent],
  );
  const noRowsComponent = useMemo(
    () => (options.noRowsOverlayComponent ? options.noRowsOverlayComponent : <NoRowMessage />),
    [options.noRowsOverlayComponent],
  );

  return { headerComponent, footerComponent, loadingComponent, noRowsComponent };
};
