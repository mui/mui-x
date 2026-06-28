import type { ChatMessageChunk, ChatStreamEnvelope } from '@mui/x-chat-headless';

export type ToolName = 'setGridState' | 'runCommands';

/** Per-tool streaming state tracked by `consumeForExecutor`. */
export interface ToolStreamState {
  toolName: ToolName;
  toolIndex: number;
  buffer: string;
  dispatched: boolean;
}

export function isEnvelope(
  value: ChatMessageChunk | ChatStreamEnvelope,
): value is ChatStreamEnvelope {
  return (
    typeof value === 'object' &&
    value !== null &&
    'chunk' in value &&
    typeof (value as ChatStreamEnvelope).chunk === 'object'
  );
}

export const SUPPORTED_TOOL_NAMES: ReadonlySet<ToolName> = new Set([
  'setGridState',
  'runCommands',
]);

export function safeParseWrapper(text: string): Record<string, unknown> | undefined {
  if (!text) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : undefined;
  } catch {
    return undefined;
  }
}
