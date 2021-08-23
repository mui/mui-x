import * as React from 'react';
import MUICheckbox from '@material-ui/core/Checkbox';
import { GRID_DEFAULT_LOCALE_TEXT } from '../../constants/localeTextConstants';
import { GridComponentProps, GridInputComponentProps } from '../../GridComponentProps';
import { GRID_DEFAULT_SIMPLE_OPTIONS } from '../../models/gridOptions';
import { composeClasses } from '../../utils/material-ui-utils';
import { getDataGridUtilityClass } from '../../utils/utils';
import { GridIconSlotsComponent, GridSlotsComponent } from '../../models';
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

const DEFAULT_GRID_ICON_SLOTS_COMPONENTS: GridIconSlotsComponent = {
  BooleanCellTrueIcon: GridCheckIcon,
  BooleanCellFalseIcon: GridCloseIcon,
  ColumnMenuIcon: GridTripleDotsVerticalIcon,
  OpenFilterButtonIcon: GridFilterListIcon,
  ColumnFilteredIcon: GridFilterAltIcon,
  ColumnSelectorIcon: GridColumnIcon,
  ColumnUnsortedIcon: GridColumnUnsortedIcon,
  ColumnSortedAscendingIcon: GridArrowUpwardIcon,
  ColumnSortedDescendingIcon: GridArrowDownwardIcon,
  ColumnResizeIcon: GridSeparatorIcon,
  DensityCompactIcon: GridViewHeadlineIcon,
  DensityStandardIcon: GridTableRowsIcon,
  DensityComfortableIcon: GridViewStreamIcon,
  ExportIcon: GridSaveAltIcon,
};

export const DEFAULT_GRID_SLOTS_COMPONENTS: GridSlotsComponent = {
  ...DEFAULT_GRID_ICON_SLOTS_COMPONENTS,
  Checkbox: MUICheckbox,
  ColumnMenu: GridColumnMenu,
  ErrorOverlay,
  Footer: GridFooter,
  Header: GridHeader,
  PreferencesPanel: GridPreferencesPanel,
  LoadingOverlay: GridLoadingOverlay,
  NoResultsOverlay: GridNoResultsOverlay,
  NoRowsOverlay: GridNoRowsOverlay,
  Pagination: GridPagination,
  FilterPanel: GridFilterPanel,
  ColumnsPanel: GridColumnsPanel,
  Panel: GridPanel,
  Toolbar: null,
};

export const useProcessedProps = (inProps: GridInputComponentProps) => {
  const classes = React.useMemo(
    () =>
      composeClasses(
        {
          root: ['root'],
          columnHeader: ['columnHeader'],
          row: ['row'],
          cell: ['cell'],
        },
        getDataGridUtilityClass,
        inProps.classes,
      ),
    [inProps.classes],
  );

  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...inProps.localeText }),
    [inProps.localeText],
  );

  const components = React.useMemo<GridSlotsComponent>(() => {
    return {
      BooleanCellTrueIcon:
        (inProps.components && inProps.components.BooleanCellTrueIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.BooleanCellTrueIcon,
      BooleanCellFalseIcon:
        (inProps.components && inProps.components.BooleanCellFalseIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.BooleanCellFalseIcon,
      ColumnFilteredIcon:
        (inProps.components && inProps.components.ColumnFilteredIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnFilteredIcon,
      ColumnMenuIcon:
        (inProps.components && inProps.components.ColumnMenuIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnMenuIcon,
      ColumnResizeIcon:
        (inProps.components && inProps.components.ColumnResizeIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnResizeIcon,
      ColumnSelectorIcon:
        (inProps.components && inProps.components.ColumnSelectorIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnSelectorIcon,
      ColumnUnsortedIcon:
        inProps.components?.ColumnUnsortedIcon || DEFAULT_GRID_SLOTS_COMPONENTS.ColumnUnsortedIcon,
      ColumnSortedAscendingIcon:
        (inProps.components && inProps.components.ColumnSortedAscendingIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnSortedAscendingIcon,
      ColumnSortedDescendingIcon:
        (inProps.components && inProps.components.ColumnSortedDescendingIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnSortedDescendingIcon,
      DensityComfortableIcon:
        (inProps.components && inProps.components.DensityComfortableIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.DensityComfortableIcon,
      DensityCompactIcon:
        (inProps.components && inProps.components.DensityCompactIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.DensityCompactIcon,
      DensityStandardIcon:
        (inProps.components && inProps.components.DensityStandardIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.DensityStandardIcon,
      ExportIcon:
        (inProps.components && inProps.components.ExportIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ExportIcon,
      OpenFilterButtonIcon:
        (inProps.components && inProps.components.OpenFilterButtonIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.OpenFilterButtonIcon,
      Checkbox:
        (inProps.components && inProps.components.Checkbox) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.Checkbox,
      ColumnMenu:
        (inProps.components && inProps.components.ColumnMenu) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnMenu,
      ErrorOverlay:
        (inProps.components && inProps.components.ErrorOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ErrorOverlay,
      Footer:
        (inProps.components && inProps.components.Footer) || DEFAULT_GRID_SLOTS_COMPONENTS.Footer,
      Header:
        (inProps.components && inProps.components.Header) || DEFAULT_GRID_SLOTS_COMPONENTS.Header,
      Toolbar:
        (inProps.components && inProps.components.Toolbar) || DEFAULT_GRID_SLOTS_COMPONENTS.Toolbar,
      PreferencesPanel:
        (inProps.components && inProps.components.PreferencesPanel) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.PreferencesPanel,
      LoadingOverlay:
        (inProps.components && inProps.components.LoadingOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.LoadingOverlay,
      NoResultsOverlay:
        (inProps.components && inProps.components.NoResultsOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.NoResultsOverlay,
      NoRowsOverlay:
        (inProps.components && inProps.components.NoRowsOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.NoRowsOverlay,
      Pagination:
        (inProps.components && inProps.components.Pagination) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.Pagination,
      FilterPanel:
        (inProps.components && inProps.components.FilterPanel) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.FilterPanel,
      ColumnsPanel:
        (inProps.components && inProps.components.ColumnsPanel) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnsPanel,
      Panel:
        (inProps.components && inProps.components.Panel) || DEFAULT_GRID_SLOTS_COMPONENTS.Panel,
    };
  }, [inProps.components]);

  return React.useMemo<GridComponentProps>(
    () => ({
      ...GRID_DEFAULT_SIMPLE_OPTIONS,
      ...inProps,
      classes,
      localeText,
      components,
    }),
    [inProps, classes, localeText, components],
  );
};
