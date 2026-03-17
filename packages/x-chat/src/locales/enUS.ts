import { CHAT_DEFAULT_LOCALE_TEXT } from '@mui/x-chat-unstyled/chat';
import { getChatLocalization } from './getChatLocalization';

function formatTimestamp(dateTime: string): string {
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) {
    return dateTime;
  }
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export const enUS = getChatLocalization({
  ...CHAT_DEFAULT_LOCALE_TEXT,
  // The styled package formats timestamps with `toLocaleTimeString`,
  // whereas the unstyled default simply returns the raw dateTime string.
  messageTimestampLabel: formatTimestamp,
  conversationTimestampLabel: formatTimestamp,
});
