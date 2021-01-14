import * as React from 'react';
import { DefaultFooter, DefaultFooterProps } from '../../components/DefaultFooter';
import { DefaultGridColumnHeaderMenuItems } from '../../components/menu/columnMenu/DefaultGridColumnHeaderMenuItems';
import { GridColumnHeaderMenuItemProps } from '../../components/menu/columnMenu/GridColumnHeaderMenu';
import { Pagination as DefaultPagination } from '../../components/Pagination';
import { DefaultToolbar } from '../../components/toolbar/DefaultToolbar';
import { BaseComponentProps, ApiRef, GridSlotsComponent, RootContainerRef } from '../../models';
import { ErrorMessage, ErrorMessageProps } from '../../components/ErrorMessage';
import { LoadingOverlay as DefaultLoading } from '../../components/LoadingOverlay';
import { NoRowMessage } from '../../components/NoRowMessage';
import { optionsSelector } from '../utils/useOptionsProp';
import { visibleColumnsSelector } from './columns/columnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';
import { unorderedRowModelsSelector } from './rows/rowsSelector';

export const useComponents = (
  componentsProp: GridSlotsComponent | undefined,
  apiRef: ApiRef,
  gridRootRef: RootContainerRef,
) => {
  const options = useGridSelector(apiRef, optionsSelector);
  const rows = useGridSelector(apiRef, unorderedRowModelsSelector);
  const columns = useGridSelector(apiRef, visibleColumnsSelector);
  const [state] = useGridState(apiRef!);

  const baseComponentProps: BaseComponentProps = React.useMemo(
    () => ({
      state,
      rows,
      columns,
      options,
      api: apiRef,
      rootElement: gridRootRef,
    }),
    [state, rows, columns, options, apiRef, gridRootRef],
  );

  const components = React.useMemo(() => {
    const ColumnMenu = componentsProp?.ColumnMenu || DefaultGridColumnHeaderMenuItems;
    const Header = componentsProp?.Header || DefaultToolbar;
    const LoadingOverlay = componentsProp?.LoadingOverlay || DefaultLoading;
    const NoRowsOverlay = componentsProp?.NoRowsOverlay || NoRowMessage;
    const Pagination = componentsProp?.Pagination || DefaultPagination;
    const Footer = componentsProp?.Footer || DefaultFooter;
    const Error = componentsProp?.ErrorOverlay || ErrorMessage;

    const wrapWithBaseProps: <TProps>(
      Component: React.ElementType<TProps & BaseComponentProps>,
    ) => React.ElementType<TProps> = <TProps extends {}>(Component) => {
      const ComponentWithBase: React.ElementType<TProps> = (props: TProps) => {
        const propsWithBase = { ...baseComponentProps, ...props };
        return <Component {...propsWithBase} />;
      };

      return ComponentWithBase;
    };

    return {
      ColumnMenu: wrapWithBaseProps<GridColumnHeaderMenuItemProps>(ColumnMenu),
      Header: wrapWithBaseProps<{}>(Header),
      LoadingOverlay: wrapWithBaseProps<{}>(LoadingOverlay),
      NoRowsOverlay: wrapWithBaseProps<{}>(NoRowsOverlay),
      Pagination: wrapWithBaseProps<{}>(Pagination),
      Error: wrapWithBaseProps<ErrorMessageProps>(Error),
      Footer: wrapWithBaseProps<DefaultFooterProps>(Footer),
    };
  }, [
    baseComponentProps,
    componentsProp?.ColumnMenu,
    componentsProp?.ErrorOverlay,
    componentsProp?.Footer,
    componentsProp?.Header,
    componentsProp?.LoadingOverlay,
    componentsProp?.NoRowsOverlay,
    componentsProp?.Pagination,
  ]);

  return components;
};
