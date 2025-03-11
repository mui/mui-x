import {
  GridSearchIcon,
  GridClearIcon,
  GridAddIcon,
  GridCheckIcon,
  GridExpandMoreIcon,
  GridExpandLessIcon,
  GridDeleteIcon,
  GridCloseIcon,
} from '@mui/x-data-grid';
import type { GridPremiumIconSlotsComponent } from '../models';
import {
  GridWorkspacesIcon,
  GridGroupWorkIcon,
  GridFunctionsIcon,
  GridSendPromptIcon,
  GridRecordPromptIcon,
  GridMoveToTopIcon,
  GridMoveToBottomIcon,
} from './icons';

const iconsSlots: GridPremiumIconSlotsComponent = {
  columnMenuUngroupIcon: GridWorkspacesIcon,
  columnMenuGroupIcon: GridGroupWorkIcon,
  columnMenuAggregationIcon: GridFunctionsIcon,
  toolbarPromptSendIcon: GridSendPromptIcon,
  toolbarPromptRecordIcon: GridRecordPromptIcon,
  pivotSearchIcon: GridSearchIcon,
  pivotSearchClearIcon: GridClearIcon,
  pivotMenuAddIcon: GridAddIcon,
  pivotMenuMoveUpIcon: GridExpandLessIcon,
  pivotMenuMoveDownIcon: GridExpandMoreIcon,
  pivotMenuMoveToTopIcon: GridMoveToTopIcon,
  pivotMenuMoveToBottomIcon: GridMoveToBottomIcon,
  pivotMenuCheckIcon: GridCheckIcon,
  pivotMenuRemoveIcon: GridDeleteIcon,
  sidebarCloseIcon: GridCloseIcon,
};

const materialSlots = {
  ...iconsSlots,
};

export default materialSlots;
