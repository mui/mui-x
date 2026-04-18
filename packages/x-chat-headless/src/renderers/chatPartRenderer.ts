import * as React from 'react';
import type { ChatMessage } from '../types/chat-entities';
import type { ChatOnToolCall } from '../types/chat-callbacks';
import type { ChatMessagePart } from '../types/chat-message-parts';

export interface ChatPartRendererProps<TPart extends ChatMessagePart = ChatMessagePart> {
  part: TPart;
  message: ChatMessage;
  index: number;
  onToolCall?: ChatOnToolCall;
}

export type ChatPartRenderer<TPart extends ChatMessagePart = ChatMessagePart> = (
  props: ChatPartRendererProps<TPart>,
) => React.ReactNode;

export type ChatPartRendererMap = Partial<{
  [TType in ChatMessagePart['type']]: ChatPartRenderer<Extract<ChatMessagePart, { type: TType }>>;
}>;
