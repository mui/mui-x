import {
  GridSearchIcon,
  GridClearIcon,
  GridAddIcon,
  GridCheckIcon,
  GridExpandMoreIcon,
  GridDeleteIcon,
  GridCloseIcon,
} from '@mui/x-data-grid';
import {
  GridArrowDownwardIcon,
  GridArrowUpwardIcon,
  GridFilterAltIcon,
} from '@mui/x-data-grid-pro';
import type { GridPremiumIconSlotsComponent } from '../models';
import {
  GridWorkspacesIcon,
  GridGroupWorkIcon,
  GridFunctionsIcon,
  GridMoveToTopIcon,
  GridMoveToBottomIcon,
  GridExpandLessIcon,
  GridPivotIcon,
  GridSendIcon,
  GridMicIcon,
  GridMicOffIcon,
  GridAssistantIcon,
  GridPromptIcon,
  GridRerunIcon,
  GridHistoryIcon,
} from './icons';

const iconsSlots: GridPremiumIconSlotsComponent = {
  collapsibleIcon: GridExpandMoreIcon,
  columnMenuUngroupIcon: GridWorkspacesIcon,
  columnMenuGroupIcon: GridGroupWorkIcon,
  columnMenuAggregationIcon: GridFunctionsIcon,
  pivotIcon: GridPivotIcon,
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
  aiAssistantIcon: GridAssistantIcon,
  aiAssistantPanelCloseIcon: GridCloseIcon,
  aiAssistantPanelNewConversationIcon: GridAddIcon,
  aiAssistantPanelHistoryIcon: GridHistoryIcon,
  promptIcon: GridPromptIcon,
  promptSendIcon: GridSendIcon,
  promptSpeechRecognitionIcon: GridMicIcon,
  promptSpeechRecognitionOffIcon: GridMicOffIcon,
  promptRerunIcon: GridRerunIcon,
  promptSortAscIcon: GridArrowUpwardIcon,
  promptSortDescIcon: GridArrowDownwardIcon,
  promptFilterIcon: GridFilterAltIcon,
  promptPivotIcon: GridPivotIcon,
  promptAggregationIcon: GridFunctionsIcon,
  promptGroupIcon: GridGroupWorkIcon,
  promptChangesToggleIcon: GridExpandMoreIcon,
};

const materialSlots = {
  ...iconsSlots,
};

export default materialSlots;
