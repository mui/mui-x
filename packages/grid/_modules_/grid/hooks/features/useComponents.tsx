import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { ApiRefComponentsProperty } from '../../models/api/componentsApi';
import { DEFAULT_SLOTS_COMPONENTS, GridSlotsComponent } from '../../models/gridSlotsComponent';
import { GridSlotsComponentsProps } from '../../models/gridSlotsComponentsProps';

export const useComponents = (
  componentSlotsProp: GridSlotsComponent | undefined,
  componentsProps: GridSlotsComponentsProps | undefined,
  apiRef: ApiRef,
) => {
  const components: ApiRefComponentsProperty = React.useMemo(() => {
    const mappedComponents = {
      ColumnFilteredIcon:
        (componentSlotsProp && componentSlotsProp.ColumnFilteredIcon) ||
        DEFAULT_SLOTS_COMPONENTS.ColumnFilteredIcon,
      ColumnMenuIcon:
        (componentSlotsProp && componentSlotsProp.ColumnMenuIcon) ||
        DEFAULT_SLOTS_COMPONENTS.ColumnMenuIcon,
      ColumnResizeIcon:
        (componentSlotsProp && componentSlotsProp.ColumnResizeIcon) ||
        DEFAULT_SLOTS_COMPONENTS.ColumnResizeIcon,
      ColumnSelectorIcon:
        (componentSlotsProp && componentSlotsProp.ColumnSelectorIcon) ||
        DEFAULT_SLOTS_COMPONENTS.ColumnSelectorIcon,
      ColumnSortedAscendingIcon:
        (componentSlotsProp && componentSlotsProp.ColumnSortedAscendingIcon) ||
        DEFAULT_SLOTS_COMPONENTS.ColumnSortedAscendingIcon,
      ColumnSortedDescendingIcon:
        (componentSlotsProp && componentSlotsProp.ColumnSortedDescendingIcon) ||
        DEFAULT_SLOTS_COMPONENTS.ColumnSortedDescendingIcon,
      DensityComfortableIcon:
        (componentSlotsProp && componentSlotsProp.DensityComfortableIcon) ||
        DEFAULT_SLOTS_COMPONENTS.DensityComfortableIcon,
      DensityCompactIcon:
        (componentSlotsProp && componentSlotsProp.DensityCompactIcon) ||
        DEFAULT_SLOTS_COMPONENTS.DensityCompactIcon,
      DensityStandardIcon:
        (componentSlotsProp && componentSlotsProp.DensityStandardIcon) ||
        DEFAULT_SLOTS_COMPONENTS.DensityStandardIcon,
      OpenFilterButtonIcon:
        (componentSlotsProp && componentSlotsProp.OpenFilterButtonIcon) ||
        DEFAULT_SLOTS_COMPONENTS.OpenFilterButtonIcon,
      ColumnMenu:
        (componentSlotsProp && componentSlotsProp.ColumnMenu) ||
        DEFAULT_SLOTS_COMPONENTS.ColumnMenu,
      ErrorOverlay:
        (componentSlotsProp && componentSlotsProp.ErrorOverlay) ||
        DEFAULT_SLOTS_COMPONENTS.ErrorOverlay,
      Footer: (componentSlotsProp && componentSlotsProp.Footer) || DEFAULT_SLOTS_COMPONENTS.Footer,
      Header: (componentSlotsProp && componentSlotsProp.Header) || DEFAULT_SLOTS_COMPONENTS.Header,
      LoadingOverlay:
        (componentSlotsProp && componentSlotsProp.LoadingOverlay) ||
        DEFAULT_SLOTS_COMPONENTS.LoadingOverlay,
      NoRowsOverlay:
        (componentSlotsProp && componentSlotsProp.NoRowsOverlay) ||
        DEFAULT_SLOTS_COMPONENTS.NoRowsOverlay,
      Pagination:
        (componentSlotsProp && componentSlotsProp.Pagination) ||
        DEFAULT_SLOTS_COMPONENTS.Pagination,
      FilterPanel:
        (componentSlotsProp && componentSlotsProp.FilterPanel) ||
        DEFAULT_SLOTS_COMPONENTS.FilterPanel,
      ColumnsPanel:
        (componentSlotsProp && componentSlotsProp.ColumnsPanel) ||
        DEFAULT_SLOTS_COMPONENTS.ColumnsPanel,
      Panel: (componentSlotsProp && componentSlotsProp.Panel) || DEFAULT_SLOTS_COMPONENTS.Panel,
    };
    apiRef.current.components = mappedComponents;
    return mappedComponents;
  }, [apiRef, componentSlotsProp]);

  apiRef.current.componentsProps = componentsProps;

  return components;
};
