import type { ChatDataPartMap, ChatToolDefinitionMap } from './chat-type-registry';

export type ChatDataPartTypePattern = `data-${string}`;

export type ChatRegisteredDataPartType = Extract<keyof ChatDataPartMap, ChatDataPartTypePattern>;

export type ChatKnownDataPartType = [ChatRegisteredDataPartType] extends [never]
  ? ChatDataPartTypePattern
  : ChatRegisteredDataPartType;

export type ChatRegisteredToolName = Extract<keyof ChatToolDefinitionMap, string>;

export type ChatKnownToolName = [ChatRegisteredToolName] extends [never]
  ? string
  : ChatRegisteredToolName;

type ChatToolDefinitionFor<TToolName extends string> = TToolName extends keyof ChatToolDefinitionMap
  ? ChatToolDefinitionMap[TToolName]
  : never;

export type ChatToolInput<TToolName extends string> = [ChatToolDefinitionFor<TToolName>] extends [
  never,
]
  ? unknown
  : ChatToolDefinitionFor<TToolName> extends { input: infer TInput }
    ? TInput
    : unknown;

export type ChatToolOutput<TToolName extends string> = [ChatToolDefinitionFor<TToolName>] extends [
  never,
]
  ? unknown
  : ChatToolDefinitionFor<TToolName> extends { output: infer TOutput }
    ? TOutput
    : unknown;
