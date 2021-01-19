import * as React from 'react';
import { GridFooterProps } from '../../components/GridFooter';
import { GridColumnHeaderMenuItemsProps } from '../../components/menu/columnMenu/GridColumnHeaderMenuItems';
import {
  BaseComponentProps,
  ApiRef,
  GridSlotsComponent,
  RootContainerRef,
  DEFAULT_SLOTS_COMPONENTS,
} from '../../models';
import { ErrorOverlayProps } from '../../components/ErrorOverlay';
import { optionsSelector } from '../utils/optionsSelector';
import { visibleColumnsSelector } from './columns/columnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';
import { unorderedRowModelsSelector } from './rows/rowsSelector';

function EmptyComponent() {
  return null;
}

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
    const allComponents = { ...DEFAULT_SLOTS_COMPONENTS, ...componentsProp };

    const wrapWithBaseProps: <TProps>(
      Component: React.ElementType<TProps & BaseComponentProps> | undefined | null,
    ) => React.ElementType<TProps> = <TProps extends {}>(Component) => {
      if (Component == null) {
        return EmptyComponent;
      }
      const ComponentWithBase: React.ElementType<TProps> = (props: TProps) => {
        const propsWithBase = { ...baseComponentProps, ...props };
        return <Component {...propsWithBase} />;
      };

      return ComponentWithBase;
    };

    return {
      ColumnMenu: wrapWithBaseProps<GridColumnHeaderMenuItemsProps>(allComponents.ColumnMenu),
      ErrorOverlay: wrapWithBaseProps<ErrorOverlayProps>(allComponents.ErrorOverlay),
      Footer: wrapWithBaseProps<GridFooterProps>(allComponents.Footer),
      Header: wrapWithBaseProps<{}>(allComponents.Header),
      LoadingOverlay: wrapWithBaseProps<{}>(allComponents.LoadingOverlay),
      NoRowsOverlay: wrapWithBaseProps<{}>(allComponents.NoRowsOverlay),
      Pagination: wrapWithBaseProps<{}>(allComponents.Pagination),
    };
  }, [baseComponentProps, componentsProp]);

  return components;
};
