import * as React from 'react';
import { DefaultFooter } from '../../components/DefaultFooter';
import { DefaultGridColumnHeaderMenuItems } from '../../components/menu/columnMenu/DefaultGridColumnHeaderMenuItems';
import { GridColumnHeaderMenuItemProps } from '../../components/menu/columnMenu/GridColumnHeaderMenu';
import { Pagination } from '../../components/Pagination';
import { DefaultToolbar } from '../../components/toolbar/DefaultToolbar';
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

  const headerComponent = componentOverrides?.Header
    ? React.createElement(componentOverrides.Header, componentProps)
    : options.showToolbar && <DefaultToolbar />;
  // [componentOverrides?.Header, componentProps, options.showToolbar],
  // );

  const loadingComponent = React.useMemo(
    () =>
      componentOverrides?.LoadingOverlay ? (
        React.createElement(componentOverrides.LoadingOverlay, componentProps)
      ) : (
        <LoadingOverlay />
      ),
    [componentOverrides, componentProps],
  );
  const noRowsComponent = React.useMemo(
    () =>
      componentOverrides?.NoRowsOverlay ? (
        React.createElement(componentOverrides.NoRowsOverlay, componentProps)
      ) : (
        <NoRowMessage />
      ),
    [componentOverrides, componentProps],
  );

  const paginationComponent = React.useMemo(
    () =>
      componentOverrides?.Pagination ? (
        React.createElement(componentOverrides.Pagination, componentProps)
      ) : (
        <Pagination />
      ),
    [componentOverrides, componentProps],
  );

  const footerComponent = componentOverrides?.Footer ? (
    React.createElement(componentOverrides.Footer, componentProps)
  ) : (
    <DefaultFooter paginationComponent={paginationComponent} />
  );
  // [componentOverrides?.Footer, componentProps, paginationComponent], ;

  const renderError = React.useCallback(
    (props) => {
      const ErrorOverlay = componentOverrides?.ErrorOverlay || ErrorMessage;
      return <ErrorOverlay {...componentProps} {...props} />;
    },
    [componentOverrides?.ErrorOverlay, componentProps],
  );

  const renderColumnMenu = React.useCallback(
    (props: GridColumnHeaderMenuItemProps) => {
      return componentOverrides?.ColumnMenu ? (
        React.createElement(componentOverrides.ColumnMenu, { ...componentProps, ...props })
      ) : (
        <DefaultGridColumnHeaderMenuItems
          hideMenu={props.hideMenu}
          currentColumn={props.currentColumn}
        />
      );
    },
    [componentOverrides, componentProps],
  );

  return {
    headerComponent,
    footerComponent,
    loadingComponent,
    noRowsComponent,
    paginationComponent,
    renderError,
    renderColumnMenu,
  };
};
