import type * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ChatProviderProps } from '@mui/x-chat-headless';
import type {
  ChatScrollToBottomAffordanceProps as RealChatScrollToBottomAffordanceProps,
  ChatTypingIndicatorProps as RealChatTypingIndicatorProps,
  ChatUnreadMarkerProps as RealChatUnreadMarkerProps,
} from '../ChatIndicators';
import type { ChatConversationsProps } from '../ChatConversations';
import type { ChatComposerProps as RealChatComposerProps } from '../ChatComposer';
import type { ChatMessageProps } from '../ChatMessage';
import type { ChatThreadProps } from '../ChatThread';
import type { ChatLocaleText } from '../locales';

export type { ChatConversationsProps } from '../ChatConversations';
export type { ChatComposerProps } from '../ChatComposer';
export type { ChatMessageProps } from '../ChatMessage';
export type { ChatThreadProps } from '../ChatThread';

export interface ChatStyledFoundationProps {
  children?: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface ChatBoxProps<Cursor = string>
  extends Omit<ChatProviderProps<Cursor>, 'children'>, ChatStyledFoundationProps {
  localeText?: Partial<ChatLocaleText>;
  slots?: Record<string, React.ElementType | undefined>;
  slotProps?: Record<string, unknown>;
}

export interface ChatTypingIndicatorProps
  extends RealChatTypingIndicatorProps, ChatStyledFoundationProps {}

export interface ChatUnreadMarkerProps
  extends RealChatUnreadMarkerProps, ChatStyledFoundationProps {}

export interface ChatScrollToBottomAffordanceProps
  extends RealChatScrollToBottomAffordanceProps, ChatStyledFoundationProps {}

export interface ChatComponentsPropsList {
  MuiChatBox: ChatBoxProps;
  MuiChatConversations: ChatConversationsProps;
  MuiChatThread: ChatThreadProps;
  MuiChatComposer: RealChatComposerProps;
  MuiChatMessage: ChatMessageProps;
  MuiChatTypingIndicator: ChatTypingIndicatorProps;
  MuiChatUnreadMarker: ChatUnreadMarkerProps;
  MuiChatScrollToBottomAffordance: ChatScrollToBottomAffordanceProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChatComponentsPropsList {}
}

export {};
