import {
  GridArrowDownwardIcon,
  GridArrowUpwardIcon,
  GridCloseIcon,
  GridFilterAltIcon,
} from '@mui/x-data-grid-pro';
import type { GridPremiumIconSlotsComponent } from '../models';
import {
  GridWorkspacesIcon,
  GridGroupWorkIcon,
  GridFunctionsIcon,
  GridSendIcon,
  GridMicIcon,
  GridMicOffIcon,
  GridAssistantIcon,
  GridPromptIcon,
  GridRerunIcon,
  GridPivotIcon,
} from './icons';

const iconsSlots: GridPremiumIconSlotsComponent = {
  columnMenuUngroupIcon: GridWorkspacesIcon,
  columnMenuGroupIcon: GridGroupWorkIcon,
  columnMenuAggregationIcon: GridFunctionsIcon,
  aiAssistantIcon: GridAssistantIcon,
  aiAssistantCloseIcon: GridCloseIcon,
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
};

const materialSlots = {
  ...iconsSlots,
};

export default materialSlots;
