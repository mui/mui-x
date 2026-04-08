'use client';
import type { ChatOnToolCall } from '../types';
import { useChatRuntimeContext } from '../internals/useChatRuntimeContext';

export function useChatOnToolCall(): ChatOnToolCall | undefined {
  return useChatRuntimeContext().onToolCall;
}
