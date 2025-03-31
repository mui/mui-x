import { GridCloseIcon } from '@mui/x-data-grid-pro';
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
};

const materialSlots = {
  ...iconsSlots,
};

export default materialSlots;
