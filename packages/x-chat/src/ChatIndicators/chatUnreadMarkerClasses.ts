import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatUnreadMarkerClasses {
  root: string;
  label: string;
}

export type ChatUnreadMarkerClassKey = keyof ChatUnreadMarkerClasses;

export function getChatUnreadMarkerUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatUnreadMarker', slot);
}

export const chatUnreadMarkerClasses: ChatUnreadMarkerClasses = generateUtilityClasses(
  'MuiChatUnreadMarker',
  ['root', 'label'],
);
