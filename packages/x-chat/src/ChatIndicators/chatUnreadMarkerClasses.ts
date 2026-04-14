import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatUnreadMarkerClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the label element. */
  label: string;
}

export type ChatUnreadMarkerClassKey = keyof ChatUnreadMarkerClasses;

export function getChatUnreadMarkerUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatUnreadMarker', slot);
}

export const chatUnreadMarkerClasses: ChatUnreadMarkerClasses = generateUtilityClasses(
  'MuiChatUnreadMarker',
  ['root', 'label'],
);

const slots: Record<ChatUnreadMarkerClassKey, string[]> = {
  root: ['root'],
  label: ['label'],
};

export const useChatUnreadMarkerUtilityClasses = (
  classes: Partial<ChatUnreadMarkerClasses> | undefined,
): ChatUnreadMarkerClasses => composeClasses(slots, getChatUnreadMarkerUtilityClass, classes);
