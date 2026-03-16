import type * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ChatProviderProps } from '@mui/x-chat-headless';
import type {
  ComposerRootProps as UnstyledComposerRootProps,
  ScrollToBottomAffordanceProps as UnstyledScrollToBottomAffordanceProps,
  TypingIndicatorProps as UnstyledTypingIndicatorProps,
  UnreadMarkerProps as UnstyledUnreadMarkerProps,
} from '@mui/x-chat-unstyled';
import type { ChatConversationsProps } from '../ChatConversations';
import type { ChatMessageProps } from '../ChatMessage';
import type { ChatThreadProps } from '../ChatThread';
import type { ChatLocaleText } from '../locales';

export type { ChatConversationsProps } from '../ChatConversations';
export type { ChatMessageProps } from '../ChatMessage';
export type { ChatThreadProps } from '../ChatThread';

export interface ChatStyledFoundationProps {
  children?: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface ChatBoxProps<Cursor = string>
  extends Omit<ChatProviderProps<Cursor>, 'children'>,
    ChatStyledFoundationProps {
  localeText?: Partial<ChatLocaleText>;
  slots?: Record<string, React.ElementType | undefined>;
  slotProps?: Record<string, unknown>;
}

export interface ChatComposerProps extends UnstyledComposerRootProps, ChatStyledFoundationProps {}

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
