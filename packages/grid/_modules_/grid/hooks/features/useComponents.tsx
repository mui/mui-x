import * as React from 'react';
import { GridFooterProps } from '../../components/GridFooter';
import { ErrorOverlayProps } from '../../components/ErrorOverlay';
import { GridColumnHeaderMenuItemsProps } from '../../components/menu/columnMenu/GridColumnHeaderMenuItems';
import { ApiRef } from '../../models/api/apiRef';
import { ApiRefComponentsProperty } from '../../models/api/componentsApi';
import { DEFAULT_SLOTS_COMPONENTS, GridSlotsComponent } from '../../models/gridSlotsComponent';
import { BaseComponentProps } from '../../models/params/baseComponentProps';
import { RootContainerRef } from '../../models/rootContainerRef';
import { optionsSelector } from '../utils/optionsSelector';
import { visibleColumnsSelector } from './columns/columnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';
import { unorderedRowModelsSelector } from './rows/rowsSelector';

function EmptyComponent() {
  return null;
}

const wrapWithProps: <TProps, StaticProps>(
  Component: React.ElementType<TProps & StaticProps> | undefined | null,
  baseComponentProps: StaticProps,
) => React.ElementType<TProps> = <TProps extends {}>(Component, baseComponentProps) => {
  if (Component == null) {
    return EmptyComponent;
  }
  const ComponentWithBase: React.ElementType<TProps> = (props: TProps) => {
    const propsWithBase = { ...baseComponentProps, ...props };
    return <Component {...propsWithBase} />;
  };

  return ComponentWithBase;
};

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

  const components: ApiRefComponentsProperty = React.useMemo(() => {
    const allComponents = { ...DEFAULT_SLOTS_COMPONENTS, ...componentsProp };

    const mappedComponents = {
      ColumnFilteredIcon: allComponents.ColumnFilteredIcon || EmptyComponent,
      ColumnMenuIcon: allComponents.ColumnMenuIcon || EmptyComponent,
      ColumnResizeIcon: allComponents.ColumnResizeIcon || EmptyComponent,
      ColumnSelectorIcon: allComponents.ColumnSelectorIcon || EmptyComponent,
      ColumnSortedAscendingIcon: allComponents.ColumnSortedAscendingIcon || EmptyComponent,
      ColumnSortedDescendingIcon: allComponents.ColumnSortedDescendingIcon || EmptyComponent,
      DensityComfortableIcon: allComponents.DensityComfortableIcon || EmptyComponent,
      DensityCompactIcon: allComponents.DensityCompactIcon || EmptyComponent,
      DensityStandardIcon: allComponents.DensityStandardIcon || EmptyComponent,
      OpenFilterButtonIcon: allComponents.OpenFilterButtonIcon || EmptyComponent,
      ColumnMenu: wrapWithProps<GridColumnHeaderMenuItemsProps, BaseComponentProps>(
        allComponents.ColumnMenu,
        baseComponentProps,
      ),
      ErrorOverlay: wrapWithProps<ErrorOverlayProps, BaseComponentProps>(
        allComponents.ErrorOverlay,
        baseComponentProps,
      ),
      Footer: wrapWithProps<GridFooterProps, BaseComponentProps>(
        allComponents.Footer,
        baseComponentProps,
      ),
      Header: wrapWithProps<{}, BaseComponentProps>(allComponents.Header, baseComponentProps),
      LoadingOverlay: wrapWithProps<{}, BaseComponentProps>(
        allComponents.LoadingOverlay,
        baseComponentProps,
      ),
      NoRowsOverlay: wrapWithProps<{}, BaseComponentProps>(
        allComponents.NoRowsOverlay,
        baseComponentProps,
      ),
      Pagination: wrapWithProps<{}, BaseComponentProps>(
        allComponents.Pagination,
        baseComponentProps,
      ),
    };

    apiRef.current.components = mappedComponents;

    return mappedComponents;
  }, [apiRef, baseComponentProps, componentsProp]);

  return components;
};
