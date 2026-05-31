'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { ChatSuggestions, chatSuggestionsClasses } from '@mui/x-chat';
import { useChat } from '@mui/x-chat-headless';
import type { ChatMessage, ChatSuggestion } from '@mui/x-chat-headless';
import { useCopilotPanelUtilityClasses, type CopilotPanelClasses } from './copilotPanelClasses';

/**
 * Compact, single-row horizontal chip strip used for the post-turn follow-up
 * suggestions rendered directly above the composer. Side panels are tall and
 * narrow, so the chips lay out in a scrollable horizontal strip instead of
 * wrapping (which would push the composer down).
 */
const PostTurnSuggestionsShell = styled('div', {
  name: 'MuiCopilotSuggestions',
  slot: 'PostTurn',
})(({ theme }) => ({
  marginBottom: theme.spacing(0.75),
  overflow: 'hidden',
  '& .MuiChatSuggestions-root': {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: theme.spacing(0.5, 0.25),
    gap: theme.spacing(0.75),
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      height: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 3,
      background: (theme.vars || theme).palette.divider,
    },
  },
  '& .MuiChatSuggestions-item': {
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
}));

// Chip rendered when an explicit `onSelect` is supplied. Mirrors the
// `ChatSuggestions` item styling (and reuses its class names) so the
// `PostTurnSuggestionsShell` overrides apply identically.
const CopilotSuggestionChip = styled('button', {
  name: 'MuiCopilotSuggestions',
  slot: 'Item',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.75, 1.5),
  borderRadius: (theme.shape.borderRadius as number) * 4,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.primary,
  fontSize: theme.typography.body2.fontSize,
  fontFamily: theme.typography.fontFamily,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color', 'border-color']),
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
    borderColor: (theme.vars || theme).palette.primary.main,
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

const CopilotSuggestionsList = styled('div', {
  name: 'MuiCopilotSuggestions',
  slot: 'List',
})({});

function getSuggestionValue(suggestion: ChatSuggestion | string): string {
  return typeof suggestion === 'string' ? suggestion : suggestion.value;
}

function getSuggestionLabel(suggestion: ChatSuggestion | string): string {
  return typeof suggestion === 'string' ? suggestion : (suggestion.label ?? suggestion.value);
}

// Extracts the string suggestions from the last assistant message's metadata
// (`message.metadata.suggestions`). Walks the list backwards and stops at the
// most recent assistant message, returning `undefined` when it has none yet.
export function getLastMessageSuggestions(messages: ChatMessage[]): string[] | undefined {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role !== 'assistant') {
      continue;
    }
    const metadata = message.metadata as { suggestions?: unknown } | undefined;
    if (metadata?.suggestions && Array.isArray(metadata.suggestions)) {
      const stringSuggestions = metadata.suggestions.filter(
        (suggestion): suggestion is string => typeof suggestion === 'string',
      );
      return stringSuggestions.length > 0 ? stringSuggestions : undefined;
    }
    return undefined;
  }
  return undefined;
}

export interface CopilotSuggestionsProps {
  /**
   * Explicit suggestion items to render. When omitted and `readFromLastMessage`
   * is set, the suggestions are derived from the last assistant message's
   * `metadata.suggestions` instead.
   */
  suggestions?: Array<ChatSuggestion | string>;
  /**
   * Read the suggestions from the last assistant message's
   * `metadata.suggestions` (the post-turn follow-up strip). Ignored when an
   * explicit `suggestions` array is provided.
   * @default false
   */
  readFromLastMessage?: boolean;
  /**
   * Called with the selected suggestion value. When provided, it overrides the
   * default composer-driven submit (the chip click no longer pre-fills/submits
   * the composer). When omitted, selecting a chip pre-fills the composer and
   * submits it (via `autoSubmit`).
   */
  onSelect?(value: string): void;
  /**
   * Maximum number of chips to render. Extra suggestions are dropped.
   */
  max?: number;
  /**
   * Whether selecting a suggestion auto-submits the composer. Ignored when
   * `onSelect` is provided.
   * @default true
   */
  autoSubmit?: boolean;
  /** Override or extend the styles applied to the component. */
  classes?: Partial<CopilotPanelClasses>;
  /** Class name applied to the root element. */
  className?: string;
}

/**
 * Post-turn suggestion chip strip rendered above the composer. Reads the last
 * assistant message's `metadata.suggestions` (when `readFromLastMessage`) or
 * renders an explicit `suggestions` array. Host-agnostic: composes the
 * `@mui/x-chat` `ChatSuggestions` primitive for the default composer-driven
 * chips, or renders host-callback chips when `onSelect` is supplied. Renders
 * nothing when there are no suggestions to show.
 */
function CopilotSuggestions(props: CopilotSuggestionsProps) {
  const {
    suggestions: suggestionsProp,
    readFromLastMessage = false,
    onSelect,
    max,
    autoSubmit = true,
    classes: classesProp,
    className,
  } = props;
  const classes = useCopilotPanelUtilityClasses(classesProp);

  // Always call the hook (rules of hooks); the derived value is only used when
  // reading from the last message.
  const { messages } = useChat();
  const lastMessageSuggestions = React.useMemo(
    () => (readFromLastMessage ? getLastMessageSuggestions(messages) : undefined),
    [readFromLastMessage, messages],
  );

  const resolved = React.useMemo<Array<ChatSuggestion | string>>(() => {
    const base = suggestionsProp ?? lastMessageSuggestions ?? [];
    return max != null ? base.slice(0, max) : base;
  }, [suggestionsProp, lastMessageSuggestions, max]);

  // When reading from the last message and the backend hasn't emitted any
  // follow-up suggestions yet, render nothing (matches the grid behavior).
  if (resolved.length === 0 && suggestionsProp == null && readFromLastMessage) {
    return null;
  }

  return (
    <PostTurnSuggestionsShell className={clsx(classes.suggestions, className)}>
      {onSelect ? (
        <CopilotSuggestionsList
          role="group"
          className={chatSuggestionsClasses.root}
        >
          {resolved.map((suggestion) => {
            const value = getSuggestionValue(suggestion);
            return (
              <CopilotSuggestionChip
                key={value}
                type="button"
                className={chatSuggestionsClasses.item}
                onClick={() => onSelect(value)}
              >
                {getSuggestionLabel(suggestion)}
              </CopilotSuggestionChip>
            );
          })}
        </CopilotSuggestionsList>
      ) : (
        <ChatSuggestions suggestions={resolved} alwaysVisible autoSubmit={autoSubmit} />
      )}
    </PostTurnSuggestionsShell>
  );
}

export { CopilotSuggestions, getSuggestionValue, getSuggestionLabel };
