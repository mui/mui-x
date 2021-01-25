import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { ApiRefComponentsProperty } from '../../models/api/componentsApi';
import { DEFAULT_SLOTS_COMPONENTS, GridSlotsComponent } from '../../models/gridSlotsComponent';
import { GridSlotsComponentsProps } from '../../models/gridSlotsComponentsProps';

function EmptyComponent() {
  return null;
}

export const useComponents = (
  componentSlotsProp: GridSlotsComponent | undefined,
  componentsProps: GridSlotsComponentsProps | undefined,
  apiRef: ApiRef,
) => {
  const components: ApiRefComponentsProperty = React.useMemo(() => {
    const allComponents = { ...DEFAULT_SLOTS_COMPONENTS, ...componentSlotsProp };

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
      ColumnMenu: allComponents.ColumnMenu || EmptyComponent,
      ErrorOverlay: allComponents.ErrorOverlay || EmptyComponent,
      Footer: allComponents.Footer || EmptyComponent,
      Header: allComponents.Header || EmptyComponent,
      LoadingOverlay: allComponents.LoadingOverlay || EmptyComponent,
      NoRowsOverlay: allComponents.NoRowsOverlay || EmptyComponent,
      Pagination: allComponents.Pagination || EmptyComponent,
      FilterPanel: allComponents.FilterPanel || EmptyComponent,
      ColumnsPanel: allComponents.ColumnsPanel || EmptyComponent,
      Panel: allComponents.Panel || EmptyComponent,
    };
    apiRef.current.components = mappedComponents;
    return mappedComponents;
  }, [apiRef, componentSlotsProp]);

  apiRef.current.componentsProps = componentsProps;

  return components;
};
