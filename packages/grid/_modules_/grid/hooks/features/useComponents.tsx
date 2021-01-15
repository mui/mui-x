import * as React from 'react';
import { DefaultFooterProps } from '../../components/DefaultFooter';
import { GridColumnHeaderMenuItemProps } from '../../components/menu/columnMenu/GridColumnHeaderMenu';
import {
  BaseComponentProps,
  ApiRef,
  GridSlotsComponent,
  RootContainerRef,
  DEFAULT_SLOTS_COMPONENTS,
} from '../../models';
import { ErrorMessageProps } from '../../components/ErrorMessage';
import { optionsSelector } from '../utils/optionsSelector';
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
    const allComponents = {...DEFAULT_SLOTS_COMPONENTS, ...componentsProp};

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
      ColumnMenu: wrapWithBaseProps<GridColumnHeaderMenuItemProps>(allComponents.ColumnMenu!),
      Header: wrapWithBaseProps<{}>(allComponents.Header!),
      LoadingOverlay: wrapWithBaseProps<{}>(allComponents.LoadingOverlay!),
      NoRowsOverlay: wrapWithBaseProps<{}>(allComponents.NoRowsOverlay!),
      Pagination: wrapWithBaseProps<{}>(allComponents.Pagination!),
      Error: wrapWithBaseProps<ErrorMessageProps>(allComponents.ErrorOverlay!),
      Footer: wrapWithBaseProps<DefaultFooterProps>(allComponents.Footer!),
    };
  }, [baseComponentProps, componentsProp]);

  return components;
};
