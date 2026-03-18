import type { ComponentsOverrides, ComponentsProps } from '@mui/material/styles';

export interface ChatComponents<Theme = unknown> {
  MuiChatBox?: {
    defaultProps?: ComponentsProps['MuiChatBox'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatBox'];
  };
  MuiChatConversations?: {
    defaultProps?: ComponentsProps['MuiChatConversations'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatConversations'];
  };
  MuiChatConversation?: {
    defaultProps?: ComponentsProps['MuiChatConversation'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatConversation'];
  };
  MuiChatConversationInput?: {
    defaultProps?: ComponentsProps['MuiChatConversationInput'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatConversationInput'];
  };
  MuiChatMessage?: {
    defaultProps?: ComponentsProps['MuiChatMessage'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatMessage'];
  };
  MuiChatTypingIndicator?: {
    defaultProps?: ComponentsProps['MuiChatTypingIndicator'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatTypingIndicator'];
  };
  MuiChatUnreadMarker?: {
    defaultProps?: ComponentsProps['MuiChatUnreadMarker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatUnreadMarker'];
  };
  MuiChatScrollToBottomAffordance?: {
    defaultProps?: ComponentsProps['MuiChatScrollToBottomAffordance'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatScrollToBottomAffordance'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChatComponents<Theme> {}
}
