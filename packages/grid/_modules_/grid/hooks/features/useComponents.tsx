import * as React from 'react';
import { ComponentProps, ApiRef, GridComponentOverridesProp, RootContainerRef } from '../../models';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { NoRowMessage } from '../../components/NoRowMessage';
import { optionsSelector } from '../utils/useOptionsProp';
import { visibleColumnsSelector } from './columns/columnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { paginationSelector } from './pagination/paginationSelector';
import { unorderedRowModelsSelector } from './rows/rowsSelector';

export const useComponents = (
  componentOverrides: GridComponentOverridesProp | undefined,
  apiRef: ApiRef,
  gridRootRef: RootContainerRef,
) => {
  const options = useGridSelector(apiRef, optionsSelector);
  const rows = useGridSelector(apiRef, unorderedRowModelsSelector);
  const columns = useGridSelector(apiRef, visibleColumnsSelector);
  const pagination = useGridSelector(apiRef, paginationSelector);

  const componentProps: ComponentProps = React.useMemo(
    () => ({
      pagination,
      rows,
      columns,
      options,
      api: apiRef,
      rootElement: gridRootRef,
    }),
    [pagination, rows, columns, options, apiRef, gridRootRef],
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
