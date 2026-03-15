import {
  styled as muiStyled,
  useThemeProps as muiUseThemeProps,
} from '@mui/material/styles';

export type MuiChatComponentName =
  | 'MuiChatBox'
  | 'MuiChatConversations'
  | 'MuiChatThread'
  | 'MuiChatComposer'
  | 'MuiChatMessage'
  | 'MuiChatTypingIndicator'
  | 'MuiChatUnreadMarker'
  | 'MuiChatScrollToBottomAffordance';

export const styled = muiStyled;

export function useChatThemeProps<Props, Name extends MuiChatComponentName>(params: {
  props: Props;
  name: Name;
}) {
  return muiUseThemeProps(params);
}
