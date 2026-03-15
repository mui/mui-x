import type * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ChatProviderProps } from '@mui/x-chat-headless';
import type {
  ComposerRootProps as UnstyledComposerRootProps,
  ConversationListRootProps as UnstyledConversationListRootProps,
  MessageRootProps as UnstyledMessageRootProps,
  ScrollToBottomAffordanceProps as UnstyledScrollToBottomAffordanceProps,
  ThreadRootProps as UnstyledThreadRootProps,
  TypingIndicatorProps as UnstyledTypingIndicatorProps,
  UnreadMarkerProps as UnstyledUnreadMarkerProps,
} from '@mui/x-chat-unstyled';

export interface ChatStyledFoundationProps {
  children?: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface ChatBoxProps<Cursor = string>
  extends Omit<ChatProviderProps<Cursor>, 'children'>,
    ChatStyledFoundationProps {
  locale?: Record<string, unknown>;
  slots?: Record<string, React.ElementType | undefined>;
  slotProps?: Record<string, unknown>;
}

export interface ChatConversationsProps
  extends UnstyledConversationListRootProps,
    ChatStyledFoundationProps {
  dense?: boolean;
}

export interface ChatThreadProps extends UnstyledThreadRootProps, ChatStyledFoundationProps {}

export interface ChatComposerProps extends UnstyledComposerRootProps, ChatStyledFoundationProps {}

export interface ChatMessageProps extends UnstyledMessageRootProps, ChatStyledFoundationProps {}

export interface ChatTypingIndicatorProps
  extends UnstyledTypingIndicatorProps,
    ChatStyledFoundationProps {}

export interface ChatUnreadMarkerProps
  extends UnstyledUnreadMarkerProps,
    ChatStyledFoundationProps {}

export interface ChatScrollToBottomAffordanceProps
  extends UnstyledScrollToBottomAffordanceProps,
    ChatStyledFoundationProps {}

export interface ChatComponentsPropsList {
  MuiChatBox: ChatBoxProps;
  MuiChatConversations: ChatConversationsProps;
  MuiChatThread: ChatThreadProps;
  MuiChatComposer: ChatComposerProps;
  MuiChatMessage: ChatMessageProps;
  MuiChatTypingIndicator: ChatTypingIndicatorProps;
  MuiChatUnreadMarker: ChatUnreadMarkerProps;
  MuiChatScrollToBottomAffordance: ChatScrollToBottomAffordanceProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChatComponentsPropsList {}
}

export {};
