import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface ChatComponents<Theme = unknown> {
  MuiChatCodeBlock?: {
    defaultProps?: ComponentsProps['MuiChatCodeBlock'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatCodeBlock'];
    variants?: ComponentsVariants<Theme>['MuiChatCodeBlock'];
  };
  MuiChatConfirmation?: {
    defaultProps?: ComponentsProps['MuiChatConfirmation'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatConfirmation'];
    variants?: ComponentsVariants<Theme>['MuiChatConfirmation'];
  };
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
  MuiChatComposer?: {
    defaultProps?: ComponentsProps['MuiChatComposer'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatComposer'];
    variants?: ComponentsVariants<Theme>['MuiChatComposer'];
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
  MuiChatSuggestions?: {
    defaultProps?: ComponentsProps['MuiChatSuggestions'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatSuggestions'];
    variants?: ComponentsVariants<Theme>['MuiChatSuggestions'];
  };
  MuiChatUnreadMarker?: {
    defaultProps?: ComponentsProps['MuiChatUnreadMarker'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatUnreadMarker'];
    variants?: ComponentsVariants<Theme>['MuiChatUnreadMarker'];
  };
  MuiChatMessageSources?: {
    defaultProps?: ComponentsProps['MuiChatMessageSources'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatMessageSources'];
    variants?: ComponentsVariants<Theme>['MuiChatMessageSources'];
  };
  MuiChatMessageSource?: {
    defaultProps?: ComponentsProps['MuiChatMessageSource'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatMessageSource'];
    variants?: ComponentsVariants<Theme>['MuiChatMessageSource'];
  };
  MuiChatMessageSkeleton?: {
    defaultProps?: ComponentsProps['MuiChatMessageSkeleton'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChatMessageSkeleton'];
    variants?: ComponentsVariants<Theme>['MuiChatMessageSkeleton'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChatComponents<Theme> {}
}
