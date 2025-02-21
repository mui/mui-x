import { GridSearchIcon } from '@mui/x-data-grid';
import type { GridPremiumIconSlotsComponent } from '../models';
import {
  GridWorkspacesIcon,
  GridGroupWorkIcon,
  GridFunctionsIcon,
  GridSendPromptIcon,
  GridRecordPromptIcon,
  GridClearIcon,
} from './icons';

const iconsSlots: GridPremiumIconSlotsComponent = {
  columnMenuUngroupIcon: GridWorkspacesIcon,
  columnMenuGroupIcon: GridGroupWorkIcon,
  columnMenuAggregationIcon: GridFunctionsIcon,
  toolbarPromptSendIcon: GridSendPromptIcon,
  toolbarPromptRecordIcon: GridRecordPromptIcon,
  pivotSearchIcon: GridSearchIcon,
  pivotSearchClearIcon: GridClearIcon,
};

const materialSlots = {
  ...iconsSlots,
};

export default materialSlots;
