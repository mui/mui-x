import * as React from 'react';
import MUICheckbox from '@material-ui/core/Checkbox';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApiRefComponentsProperty } from '../../models/api/gridComponentsApi';
import {
  GridArrowDownwardIcon,
  GridArrowUpwardIcon,
  GridCheckIcon,
  GridCloseIcon,
  GridColumnIcon,
  GridColumnMenu,
  GridColumnsPanel,
  GridFilterAltIcon,
  GridFilterListIcon,
  GridFilterPanel,
  GridFooter,
  GridHeader,
  GridLoadingOverlay,
  GridNoRowsOverlay,
  GridPagination,
  GridPanel,
  GridPreferencesPanel,
  GridSaveAltIcon,
  GridSeparatorIcon,
  GridTableRowsIcon,
  GridTripleDotsVerticalIcon,
  GridViewHeadlineIcon,
  GridViewStreamIcon,
} from '../../components';
import { GridColumnUnsortedIcon } from '../../components/columnHeaders/GridColumnUnsortedIcon';
import { ErrorOverlay } from '../../components/ErrorOverlay';
import { GridNoResultsOverlay } from '../../components/GridNoResultsOverlay';
import { GridComponentProps } from '../../GridComponentProps';

export const DEFAULT_GRID_SLOTS_COMPONENTS: GridApiRefComponentsProperty = {
  BooleanCellFalseIcon: GridCloseIcon,
  BooleanCellTrueIcon: GridCheckIcon,
  Checkbox: MUICheckbox,
  ColumnFilteredIcon: GridFilterAltIcon,
  ColumnMenu: GridColumnMenu,
  ColumnMenuIcon: GridTripleDotsVerticalIcon,
  ColumnResizeIcon: GridSeparatorIcon,
  ColumnSelectorIcon: GridColumnIcon,
  ColumnSortedAscendingIcon: GridArrowUpwardIcon,
  ColumnSortedDescendingIcon: GridArrowDownwardIcon,
  ColumnsPanel: GridColumnsPanel,
  ColumnUnsortedIcon: GridColumnUnsortedIcon,
  DensityComfortableIcon: GridViewStreamIcon,
  DensityCompactIcon: GridViewHeadlineIcon,
  DensityStandardIcon: GridTableRowsIcon,
  ErrorOverlay,
  ExportIcon: GridSaveAltIcon,
  FilterPanel: GridFilterPanel,
  Footer: GridFooter,
  Header: GridHeader,
  LoadingOverlay: GridLoadingOverlay,
  NoResultsOverlay: GridNoResultsOverlay,
  NoRowsOverlay: GridNoRowsOverlay,
  OpenFilterButtonIcon: GridFilterListIcon,
  Pagination: GridPagination,
  Panel: GridPanel,
  PreferencesPanel: GridPreferencesPanel,
};

export const useGridComponents = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'components' | 'componentsProps'>,
) => {
  const mappedComponents = React.useMemo<GridApiRefComponentsProperty>(() => {
    return {
      BooleanCellTrueIcon:
        (props.components && props.components.BooleanCellTrueIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.BooleanCellTrueIcon,
      BooleanCellFalseIcon:
        (props.components && props.components.BooleanCellFalseIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.BooleanCellFalseIcon,
      ColumnFilteredIcon:
        (props.components && props.components.ColumnFilteredIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnFilteredIcon,
      ColumnMenuIcon:
        (props.components && props.components.ColumnMenuIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnMenuIcon,
      ColumnResizeIcon:
        (props.components && props.components.ColumnResizeIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnResizeIcon,
      ColumnSelectorIcon:
        (props.components && props.components.ColumnSelectorIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnSelectorIcon,
      ColumnUnsortedIcon:
        props.components?.ColumnUnsortedIcon === undefined
          ? DEFAULT_GRID_SLOTS_COMPONENTS.ColumnUnsortedIcon
          : props.components?.ColumnUnsortedIcon,
      ColumnSortedAscendingIcon:
        (props.components && props.components.ColumnSortedAscendingIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnSortedAscendingIcon,
      ColumnSortedDescendingIcon:
        (props.components && props.components.ColumnSortedDescendingIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnSortedDescendingIcon,
      DensityComfortableIcon:
        (props.components && props.components.DensityComfortableIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.DensityComfortableIcon,
      DensityCompactIcon:
        (props.components && props.components.DensityCompactIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.DensityCompactIcon,
      DensityStandardIcon:
        (props.components && props.components.DensityStandardIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.DensityStandardIcon,
      ExportIcon:
        (props.components && props.components.ExportIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ExportIcon,
      OpenFilterButtonIcon:
        (props.components && props.components.OpenFilterButtonIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.OpenFilterButtonIcon,
      Checkbox:
        (props.components && props.components.Checkbox) || DEFAULT_GRID_SLOTS_COMPONENTS.Checkbox,
      ColumnMenu:
        (props.components && props.components.ColumnMenu) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnMenu,
      ErrorOverlay:
        (props.components && props.components.ErrorOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ErrorOverlay,
      Footer: (props.components && props.components.Footer) || DEFAULT_GRID_SLOTS_COMPONENTS.Footer,
      Header: (props.components && props.components.Header) || DEFAULT_GRID_SLOTS_COMPONENTS.Header,
      Toolbar: props.components && props.components.Toolbar,
      PreferencesPanel:
        (props.components && props.components.PreferencesPanel) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.PreferencesPanel,
      LoadingOverlay:
        (props.components && props.components.LoadingOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.LoadingOverlay,
      NoResultsOverlay:
        (props.components && props.components.NoResultsOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.NoResultsOverlay,
      NoRowsOverlay:
        (props.components && props.components.NoRowsOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.NoRowsOverlay,
      Pagination:
        (props.components && props.components.Pagination) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.Pagination,
      FilterPanel:
        (props.components && props.components.FilterPanel) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.FilterPanel,
      ColumnsPanel:
        (props.components && props.components.ColumnsPanel) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnsPanel,
      Panel: (props.components && props.components.Panel) || DEFAULT_GRID_SLOTS_COMPONENTS.Panel,
    };
  }, [props.components]);

  apiRef.current.components = mappedComponents;
  apiRef.current.componentsProps = props.componentsProps;
};
