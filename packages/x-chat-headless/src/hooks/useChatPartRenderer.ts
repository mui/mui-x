'use client';
import type { ChatPartRenderer } from '../renderers';
import { useChatRuntimeContext } from '../internals/useChatRuntimeContext';
import type { ChatMessagePart } from '../types/chat-message-parts';

export function useChatPartRenderer<TPartType extends ChatMessagePart['type']>(
  partType: TPartType,
): ChatPartRenderer<Extract<ChatMessagePart, { type: TPartType }>> | null {
  const { partRenderers } = useChatRuntimeContext();

  return (
    (partRenderers[partType] as
      | ChatPartRenderer<Extract<ChatMessagePart, { type: TPartType }>>
      | undefined) ?? null
  );
}
