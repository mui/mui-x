import * as React from 'react';
import MUICheckbox from '@mui/material/Checkbox';
import { GRID_DEFAULT_LOCALE_TEXT } from '../../constants/localeTextConstants';
import { GridComponentProps, GridInputComponentProps } from '../../GridComponentProps';
import { GRID_DEFAULT_SIMPLE_OPTIONS } from '../../models/gridOptions';
import { GridIconSlotsComponent, GridSlotsComponent } from '../../models';
import {
  GridArrowDownwardIcon,
  GridArrowUpwardIcon,
  GridCell,
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
  GridRow,
  GridSaveAltIcon,
  GridSeparatorIcon,
  GridTableRowsIcon,
  GridTripleDotsVerticalIcon,
  GridViewHeadlineIcon,
  GridViewStreamIcon,
  GridMoreVertIcon,
  GridExpandMoreIcon,
  GridExpandLessIcon,
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
  MoreActionsIcon: GridMoreVertIcon,
  TreeDataCollapseIcon: GridExpandLessIcon,
  TreeDataExpandIcon: GridExpandMoreIcon,
};

const DEFAULT_GRID_SLOTS_COMPONENTS: GridSlotsComponent = {
  ...DEFAULT_GRID_ICON_SLOTS_COMPONENTS,
  Cell: GridCell,
  Checkbox: MUICheckbox,
  ColumnMenu: GridColumnMenu,
  ErrorOverlay,
  Footer: GridFooter,
  Header: GridHeader,
  Toolbar: null,
  PreferencesPanel: GridPreferencesPanel,
  LoadingOverlay: GridLoadingOverlay,
  NoResultsOverlay: GridNoResultsOverlay,
  NoRowsOverlay: GridNoRowsOverlay,
  Pagination: GridPagination,
  FilterPanel: GridFilterPanel,
  ColumnsPanel: GridColumnsPanel,
  Panel: GridPanel,
  Row: GridRow,
};

export const useGridProcessedProps = (inProps: GridInputComponentProps) => {
  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...inProps.localeText }),
    [inProps.localeText],
  );

  const components = React.useMemo<GridSlotsComponent>(() => {
    const overrides = inProps.components;

    if (!overrides) {
      return { ...DEFAULT_GRID_SLOTS_COMPONENTS };
    }

    const mergedComponents = {} as GridSlotsComponent;

    Object.keys(DEFAULT_GRID_SLOTS_COMPONENTS).forEach((key) => {
      mergedComponents[key] =
        overrides[key] === undefined ? DEFAULT_GRID_SLOTS_COMPONENTS[key] : overrides[key];
    });

    return mergedComponents;
  }, [inProps.components]);

  return React.useMemo<GridComponentProps>(
    () => ({
      ...GRID_DEFAULT_SIMPLE_OPTIONS,
      ...inProps,
      localeText,
      components,
    }),
    [inProps, localeText, components],
  );
};
