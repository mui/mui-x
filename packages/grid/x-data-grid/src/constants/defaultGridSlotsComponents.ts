import MUICheckbox from '@mui/material/Checkbox';
import MUITextField from '@mui/material/TextField';
import MUIFormControl from '@mui/material/FormControl';
import MUISelect from '@mui/material/Select';
import MUISwitch from '@mui/material/Switch';
import MUIButton from '@mui/material/Button';
import MUITooltip from '@mui/material/Tooltip';
import MUIPopper from '@mui/material/Popper';
import { GridIconSlotsComponent, GridSlotsComponent } from '../models';
import {
  GridArrowDownwardIcon,
  GridArrowUpwardIcon,
  GridCell,
  GridSkeletonCell,
  GridCheckIcon,
  GridCloseIcon,
  GridColumnIcon,
  GridColumnMenuDefault,
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
  GridKeyboardArrowRight,
  GridAddIcon,
  GridRemoveIcon,
  GridDragIcon,
  GridColumnHeaderFilterIconButton,
  GridSearchIcon,
  GridVisibilityOffIcon,
  GridViewColumnIcon,
  GridClearIcon,
} from '../components';
import { GridColumnUnsortedIcon } from '../components/columnHeaders/GridColumnUnsortedIcon';
import { ErrorOverlay } from '../components/ErrorOverlay';
import { GridNoResultsOverlay } from '../components/GridNoResultsOverlay';

const DEFAULT_GRID_ICON_SLOTS_COMPONENTS: GridIconSlotsComponent = {
  BooleanCellTrueIcon: GridCheckIcon,
  BooleanCellFalseIcon: GridCloseIcon,
  ColumnMenuIcon: GridTripleDotsVerticalIcon,
  OpenFilterButtonIcon: GridFilterListIcon,
  FilterPanelDeleteIcon: GridCloseIcon,
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
  TreeDataCollapseIcon: GridExpandMoreIcon,
  TreeDataExpandIcon: GridKeyboardArrowRight,
  GroupingCriteriaCollapseIcon: GridExpandMoreIcon,
  GroupingCriteriaExpandIcon: GridKeyboardArrowRight,
  DetailPanelExpandIcon: GridAddIcon,
  DetailPanelCollapseIcon: GridRemoveIcon,
  RowReorderIcon: GridDragIcon,
  QuickFilterIcon: GridSearchIcon,
  QuickFilterClearIcon: GridCloseIcon,
  ColumnMenuHideIcon: GridVisibilityOffIcon,
  ColumnMenuSortAscendingIcon: GridArrowUpwardIcon,
  ColumnMenuSortDescendingIcon: GridArrowDownwardIcon,
  ColumnMenuFilterIcon: GridFilterAltIcon,
  ColumnMenuManageColumnsIcon: GridViewColumnIcon,
  ColumnMenuClearIcon: GridClearIcon,
};

/**
 * TODO: Differentiate community and pro value and interface
 */
export const DATA_GRID_DEFAULT_SLOTS_COMPONENTS: GridSlotsComponent = {
  ...DEFAULT_GRID_ICON_SLOTS_COMPONENTS,
  BaseCheckbox: MUICheckbox,
  BaseTextField: MUITextField,
  BaseFormControl: MUIFormControl,
  BaseSelect: MUISelect,
  BaseSwitch: MUISwitch,
  BaseButton: MUIButton,
  BaseTooltip: MUITooltip,
  BasePopper: MUIPopper,
  Cell: GridCell,
  SkeletonCell: GridSkeletonCell,
  ColumnHeaderFilterIconButton: GridColumnHeaderFilterIconButton,
  ColumnMenu: GridColumnMenuDefault,
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
