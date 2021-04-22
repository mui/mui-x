import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApiRefComponentsProperty } from '../../models/api/gridComponentsApi';
import { DEFAULT_GRID_SLOTS_COMPONENTS, GridSlotsComponent } from '../../models/gridSlotsComponent';
import { GridSlotsComponentsProps } from '../../models/gridSlotsComponentsProps';

export const useGridComponents = (
  componentSlotsProp: GridSlotsComponent | undefined,
  componentsProps: GridSlotsComponentsProps | undefined,
  apiRef: GridApiRef,
) => {
  const components: GridApiRefComponentsProperty = React.useMemo(() => {
    const mappedComponents = {
      BooleanCellTrueIcon:
        (componentSlotsProp && componentSlotsProp.BooleanCellTrueIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.BooleanCellTrueIcon,
      BooleanCellFalseIcon:
        (componentSlotsProp && componentSlotsProp.BooleanCellFalseIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.BooleanCellFalseIcon,
      ColumnFilteredIcon:
        (componentSlotsProp && componentSlotsProp.ColumnFilteredIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnFilteredIcon,
      ColumnMenuIcon:
        (componentSlotsProp && componentSlotsProp.ColumnMenuIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnMenuIcon,
      ColumnResizeIcon:
        (componentSlotsProp && componentSlotsProp.ColumnResizeIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnResizeIcon,
      ColumnSelectorIcon:
        (componentSlotsProp && componentSlotsProp.ColumnSelectorIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnSelectorIcon,
      ColumnSortedAscendingIcon:
        (componentSlotsProp && componentSlotsProp.ColumnSortedAscendingIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnSortedAscendingIcon,
      ColumnSortedDescendingIcon:
        (componentSlotsProp && componentSlotsProp.ColumnSortedDescendingIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnSortedDescendingIcon,
      DensityComfortableIcon:
        (componentSlotsProp && componentSlotsProp.DensityComfortableIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.DensityComfortableIcon,
      DensityCompactIcon:
        (componentSlotsProp && componentSlotsProp.DensityCompactIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.DensityCompactIcon,
      DensityStandardIcon:
        (componentSlotsProp && componentSlotsProp.DensityStandardIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.DensityStandardIcon,
      ExportIcon:
        (componentSlotsProp && componentSlotsProp.ExportIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ExportIcon,
      OpenFilterButtonIcon:
        (componentSlotsProp && componentSlotsProp.OpenFilterButtonIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.OpenFilterButtonIcon,
      ColumnMenu:
        (componentSlotsProp && componentSlotsProp.ColumnMenu) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnMenu,
      ErrorOverlay:
        (componentSlotsProp && componentSlotsProp.ErrorOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ErrorOverlay,
      Footer:
        (componentSlotsProp && componentSlotsProp.Footer) || DEFAULT_GRID_SLOTS_COMPONENTS.Footer,
      Header:
        (componentSlotsProp && componentSlotsProp.Header) || DEFAULT_GRID_SLOTS_COMPONENTS.Header,
      Toolbar: componentSlotsProp && componentSlotsProp.Toolbar,
      PreferencesPanel:
        (componentSlotsProp && componentSlotsProp.PreferencesPanel) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.PreferencesPanel,
      LoadingOverlay:
        (componentSlotsProp && componentSlotsProp.LoadingOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.LoadingOverlay,
      NoResultsOverlay:
        (componentSlotsProp && componentSlotsProp.NoResultsOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.NoResultsOverlay,
      NoRowsOverlay:
        (componentSlotsProp && componentSlotsProp.NoRowsOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.NoRowsOverlay,
      Pagination:
        (componentSlotsProp && componentSlotsProp.Pagination) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.Pagination,
      FilterPanel:
        (componentSlotsProp && componentSlotsProp.FilterPanel) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.FilterPanel,
      ColumnsPanel:
        (componentSlotsProp && componentSlotsProp.ColumnsPanel) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnsPanel,
      Panel:
        (componentSlotsProp && componentSlotsProp.Panel) || DEFAULT_GRID_SLOTS_COMPONENTS.Panel,
    };
    apiRef.current.components = mappedComponents;
    return mappedComponents;
  }, [apiRef, componentSlotsProp]);

  apiRef.current.componentsProps = componentsProps;

  return components;
};
