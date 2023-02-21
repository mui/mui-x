import MUICheckbox from '@mui/material/Checkbox';
import MUITextField from '@mui/material/TextField';
import MUIFormControl from '@mui/material/FormControl';
import MUISelect from '@mui/material/Select';
import MUISwitch from '@mui/material/Switch';
import MUIButton from '@mui/material/Button';
import MUIIconButton from '@mui/material/IconButton';
import MUITooltip from '@mui/material/Tooltip';
import MUIPopper from '@mui/material/Popper';
import { GridSlotsComponent } from '../models';
import {
  GridCell,
  GridSkeletonCell,
  GridColumnsPanel,
  GridFilterPanel,
  GridFooter,
  GridLoadingOverlay,
  GridNoRowsOverlay,
  GridPagination,
  GridPanel,
  GridPreferencesPanel,
  GridRow,
  GridColumnHeaderFilterIconButton,
} from '../components';
import { GridColumnMenu } from '../components/menu/columnMenu/GridColumnMenu';
import { GridNoResultsOverlay } from '../components/GridNoResultsOverlay';
import materialSlots from '../material';

export const DATA_GRID_DEFAULT_SLOTS_COMPONENTS: GridSlotsComponent = {
  ...materialSlots,
  BaseCheckbox: MUICheckbox,
  BaseTextField: MUITextField,
  BaseFormControl: MUIFormControl,
  BaseSelect: MUISelect,
  BaseSwitch: MUISwitch,
  BaseButton: MUIButton,
  BaseIconButton: MUIIconButton,
  BaseTooltip: MUITooltip,
  BasePopper: MUIPopper,
  Cell: GridCell,
  SkeletonCell: GridSkeletonCell,
  ColumnHeaderFilterIconButton: GridColumnHeaderFilterIconButton,
  ColumnMenu: GridColumnMenu,
  Footer: GridFooter,
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
