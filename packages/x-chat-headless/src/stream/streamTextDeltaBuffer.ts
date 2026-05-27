import type { ChatStore } from '../store/ChatStore';
import type { ChatMessage } from '../types/chat-entities';
import { findLastStreamingPartIndex, updateMessageParts } from './streamHelpers';

export interface TextDeltaBuffer {
  resolveTextLikePartIndex: (
    partType: 'text' | 'reasoning',
    streamId: string,
    partIndexesByStreamId: Map<string, number>,
  ) => number;
  applyTextLikeDelta: (partType: 'text' | 'reasoning', streamId: string, delta: string) => void;
  flushPendingTextLikeDelta: () => void;
  scheduleTextLikeDelta: (partType: 'text' | 'reasoning', streamId: string, delta: string) => void;
  clearPendingTextLikeDeltaTimer: () => void;
  textPartIndexesByStreamId: Map<string, number>;
  reasoningPartIndexesByStreamId: Map<string, number>;
}

/**
 * Creates a self-contained text/reasoning delta buffer subsystem.
 *
 * Batches rapid text deltas into a single store update scheduled via `flushInterval` (ms).
 * Callers must invoke `flushPendingTextLikeDelta()` before any non-delta operation
 * and `clearPendingTextLikeDeltaTimer()` in the finally block.
 */
export function createTextDeltaBuffer(
  storeUnknown: ChatStore<unknown>,
  ensureAssistantMessage: () => ChatMessage,
  flushInterval: number,
): TextDeltaBuffer {
  const textPartIndexesByStreamId = new Map<string, number>();
  const reasoningPartIndexesByStreamId = new Map<string, number>();

  let pendingTextLikeDelta: {
    partType: 'text' | 'reasoning';
    streamId: string;
    delta: string;
  } | null = null;
  let pendingTextLikeDeltaTimer: ReturnType<typeof setTimeout> | null = null;

  const clearPendingTextLikeDeltaTimer = () => {
    if (pendingTextLikeDeltaTimer) {
      clearTimeout(pendingTextLikeDeltaTimer);
      pendingTextLikeDeltaTimer = null;
    }
  };

  const resolveTextLikePartIndex = (
    partType: 'text' | 'reasoning',
    streamId: string,
    partIndexesByStreamId: Map<string, number>,
  ) => {
    const message = ensureAssistantMessage();
    const mappedIndex = partIndexesByStreamId.get(streamId);

    if (mappedIndex != null && message.parts[mappedIndex]?.type === partType) {
      return mappedIndex;
    }

    const fallbackIndex = findLastStreamingPartIndex(message.parts, partType);

    if (fallbackIndex !== -1) {
      partIndexesByStreamId.set(streamId, fallbackIndex);
      return fallbackIndex;
    }

    const nextIndex = message.parts.length;
    const nextPart =
      partType === 'text'
        ? ({ type: 'text', text: '', state: 'streaming' } as const)
        : ({ type: 'reasoning', text: '', state: 'streaming' } as const);

    storeUnknown.updateMessage(message.id, { parts: [...message.parts, nextPart] });
    partIndexesByStreamId.set(streamId, nextIndex);

    return nextIndex;
  };

  const applyTextLikeDelta = (partType: 'text' | 'reasoning', streamId: string, delta: string) => {
    const indexMap =
      partType === 'text' ? textPartIndexesByStreamId : reasoningPartIndexesByStreamId;
    const partIndex = resolveTextLikePartIndex(partType, streamId, indexMap);

    updateMessageParts(storeUnknown, ensureAssistantMessage().id, (parts) => {
      const currentPart = parts[partIndex];

      if (currentPart?.type !== partType) {
        return parts;
      }

      const nextParts = [...parts];
      nextParts[partIndex] = {
        ...currentPart,
        text: `${currentPart.text}${delta}`,
        state: 'streaming',
      };
      return nextParts;
    });
  };

  const flushPendingTextLikeDelta = () => {
    if (!pendingTextLikeDelta) {
      return;
    }

    const { partType, streamId, delta } = pendingTextLikeDelta;
    pendingTextLikeDelta = null;
    clearPendingTextLikeDeltaTimer();
    applyTextLikeDelta(partType, streamId, delta);
  };

  const scheduleTextLikeDelta = (
    partType: 'text' | 'reasoning',
    streamId: string,
    delta: string,
  ) => {
    if (
      pendingTextLikeDelta &&
      (pendingTextLikeDelta.partType !== partType || pendingTextLikeDelta.streamId !== streamId)
    ) {
      flushPendingTextLikeDelta();
    }

    if (!pendingTextLikeDelta) {
      pendingTextLikeDelta = {
        partType,
        streamId,
        delta,
      };

      clearPendingTextLikeDeltaTimer();
      pendingTextLikeDeltaTimer = setTimeout(() => {
        flushPendingTextLikeDelta();
      }, flushInterval);
      return;
    }

    pendingTextLikeDelta = {
      ...pendingTextLikeDelta,
      delta: `${pendingTextLikeDelta.delta}${delta}`,
    };
  };

  return {
    resolveTextLikePartIndex,
    applyTextLikeDelta,
    flushPendingTextLikeDelta,
    scheduleTextLikeDelta,
    clearPendingTextLikeDeltaTimer,
    textPartIndexesByStreamId,
    reasoningPartIndexesByStreamId,
  };
}
