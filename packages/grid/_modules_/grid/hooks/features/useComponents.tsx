import * as React from 'react';
import { PaginationProps } from './usePagination';
import {
  ComponentProps,
  ApiRef,
  GridComponentOverridesProp,
  GridOptions,
  RootContainerRef,
  InternalColumns,
  Rows,
} from '../../models';
import { ErrorMessage } from '../../components/error-message';
import { LoadingOverlay } from '../../components/loading-overlay';
import { NoRowMessage } from '../../components/no-row-message';

export const useComponents = (
  columns: InternalColumns,
  rows: Rows,
  options: GridOptions,
  componentOverrides: GridComponentOverridesProp | undefined,
  paginationProps: PaginationProps,
  apiRef: ApiRef,
  gridRootRef: RootContainerRef,
) => {
  const componentProps: ComponentProps = React.useMemo(
    () => ({
      paginationProps,
      rows,
      columns: columns.visible,
      options,
      api: apiRef,
      rootElement: gridRootRef,
    }),
    [paginationProps, rows, columns, options, apiRef, gridRootRef],
  );

  const headerComponent = React.useMemo(
    () =>
      componentOverrides?.header
        ? React.createElement(componentOverrides.header, componentProps)
        : null,
    [componentOverrides, componentProps],
  );
  const footerComponent = React.useMemo(
    () =>
      componentOverrides?.footer
        ? React.createElement(componentOverrides.footer, componentProps)
        : null,
    [componentOverrides, componentProps],
  );

  const loadingComponent = React.useMemo(
    () =>
      componentOverrides?.loadingOverlay ? (
        React.createElement(componentOverrides.loadingOverlay, componentProps)
      ) : (
        <LoadingOverlay />
      ),
    [componentOverrides, componentProps],
  );
  const noRowsComponent = React.useMemo(
    () =>
      componentOverrides?.noRowsOverlay ? (
        React.createElement(componentOverrides.noRowsOverlay, componentProps)
      ) : (
        <NoRowMessage />
      ),
    [componentOverrides, componentProps],
  );

  const paginationComponent = React.useMemo(
    () =>
      componentOverrides?.pagination
        ? React.createElement(componentOverrides.pagination, componentProps)
        : null,
    [componentOverrides, componentProps],
  );

  const renderError = React.useCallback(
    (props) => {
      const ErrorOverlay = componentOverrides?.errorOverlay || ErrorMessage;
      return <ErrorOverlay {...componentProps} {...props} />;
    },
    [componentOverrides?.errorOverlay, componentProps],
  );

  return {
    headerComponent,
    footerComponent,
    loadingComponent,
    noRowsComponent,
    paginationComponent,
    renderError,
  };
};
