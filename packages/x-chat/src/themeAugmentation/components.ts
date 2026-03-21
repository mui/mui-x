import {
  ComponentsProps,
  ComponentsOverrides as MuiComponentsOverrides,
} from '@mui/material/styles';

export interface ChatComponents<Theme = unknown> {
  MuiChatBox?: {
    defaultProps?: ComponentsProps['MuiChatBox'];
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiChatBox'];
  };
  MuiChatMessage?: {
    defaultProps?: ComponentsProps['MuiChatMessage'];
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiChatMessage'];
  };
  MuiChatMessageList?: {
    defaultProps?: ComponentsProps['MuiChatMessageList'];
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiChatMessageList'];
  };
  MuiChatConversation?: {
    defaultProps?: ComponentsProps['MuiChatConversation'];
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiChatConversation'];
  };
  MuiChatConversationInput?: {
    defaultProps?: ComponentsProps['MuiChatConversationInput'];
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiChatConversationInput'];
  };
  MuiChatConversationList?: {
    defaultProps?: ComponentsProps['MuiChatConversationList'];
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiChatConversationList'];
  };
  MuiChatIndicator?: {
    defaultProps?: ComponentsProps['MuiChatIndicator'];
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiChatIndicator'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChatComponents<Theme> {}
}
