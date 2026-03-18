export interface ChatComponentNameToClassKey {
  MuiChatBox: 'root';
  MuiChatConversations: 'root';
  MuiChatConversation: 'root';
  MuiChatConversationInput: 'root';
  MuiChatMessage: 'root';
  MuiChatTypingIndicator: 'root';
  MuiChatUnreadMarker: 'root';
  MuiChatScrollToBottomAffordance: 'root';
}

export interface PaletteChat {
  userMessageBg?: string;
  userMessageColor?: string;
  assistantMessageBg?: string;
  assistantMessageColor?: string;
  conversationHoverBg?: string;
  conversationSelectedBg?: string;
  conversationSelectedColor?: string;
  composerBorder?: string;
  composerFocusRing?: string;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChatComponentNameToClassKey {}

  interface CssVarsPalette {
    Chat: PaletteChat;
  }

  interface PaletteOptions {
    Chat?: Partial<PaletteChat>;
  }
}

export {};
