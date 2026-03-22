import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface ChatComponents<Theme = unknown> {
  MuiChatBox?: {
    defaultProps?: ComponentsProps['MuiChatBox'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatBox'];
    variants?: ComponentsVariants<Theme>['MuiChatBox'];
  };
  MuiChatMessage?: {
    defaultProps?: ComponentsProps['MuiChatMessage'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatMessage'];
    variants?: ComponentsVariants<Theme>['MuiChatMessage'];
  };
  MuiChatMessageList?: {
    defaultProps?: ComponentsProps['MuiChatMessageList'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatMessageList'];
    variants?: ComponentsVariants<Theme>['MuiChatMessageList'];
  };
  MuiChatConversation?: {
    defaultProps?: ComponentsProps['MuiChatConversation'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatConversation'];
    variants?: ComponentsVariants<Theme>['MuiChatConversation'];
  };
  MuiChatConversationInput?: {
    defaultProps?: ComponentsProps['MuiChatConversationInput'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatConversationInput'];
    variants?: ComponentsVariants<Theme>['MuiChatConversationInput'];
  };
  MuiChatConversationList?: {
    defaultProps?: ComponentsProps['MuiChatConversationList'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatConversationList'];
    variants?: ComponentsVariants<Theme>['MuiChatConversationList'];
  };
  MuiChatTypingIndicator?: {
    defaultProps?: ComponentsProps['MuiChatTypingIndicator'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatTypingIndicator'];
    variants?: ComponentsVariants<Theme>['MuiChatTypingIndicator'];
  };
  MuiChatScrollToBottomAffordance?: {
    defaultProps?: ComponentsProps['MuiChatScrollToBottomAffordance'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatScrollToBottomAffordance'];
    variants?: ComponentsVariants<Theme>['MuiChatScrollToBottomAffordance'];
  };
  MuiChatUnreadMarker?: {
    defaultProps?: ComponentsProps['MuiChatUnreadMarker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatUnreadMarker'];
    variants?: ComponentsVariants<Theme>['MuiChatUnreadMarker'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChatComponents<Theme> {}
}
