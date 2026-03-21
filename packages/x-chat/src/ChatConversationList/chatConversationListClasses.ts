import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatConversationListClasses {
  /** Styles applied to the conversation list root element. */
  root: string;
  /** Styles applied to the scroller element. */
  scroller: string;
  /** Styles applied to the list item element. */
  item: string;
  /** Styles applied to the item avatar element. */
  itemAvatar: string;
  /** Styles applied to the item content element. */
  itemContent: string;
  /** Styles applied to the item title element. */
  itemTitle: string;
  /** Styles applied to the item preview element. */
  itemPreview: string;
  /** Styles applied to the item timestamp element. */
  itemTimestamp: string;
  /** Styles applied to the item unread badge element. */
  itemUnreadBadge: string;
}

export type ChatConversationListClassKey = keyof ChatConversationListClasses;

export function getChatConversationListUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatConversationList', slot);
}

export const chatConversationListClasses: ChatConversationListClasses = generateUtilityClasses(
  'MuiChatConversationList',
  [
    'root',
    'scroller',
    'item',
    'itemAvatar',
    'itemContent',
    'itemTitle',
    'itemPreview',
    'itemTimestamp',
    'itemUnreadBadge',
  ],
);

const slots: Record<ChatConversationListClassKey, string[]> = {
  root: ['root'],
  scroller: ['scroller'],
  item: ['item'],
  itemAvatar: ['itemAvatar'],
  itemContent: ['itemContent'],
  itemTitle: ['itemTitle'],
  itemPreview: ['itemPreview'],
  itemTimestamp: ['itemTimestamp'],
  itemUnreadBadge: ['itemUnreadBadge'],
};

export const useChatConversationListUtilityClasses = (
  classes: Partial<ChatConversationListClasses> | undefined,
): ChatConversationListClasses =>
  composeClasses(slots, getChatConversationListUtilityClass, classes);
