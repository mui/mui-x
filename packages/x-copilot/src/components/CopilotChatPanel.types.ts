import * as React from 'react';
import type {
  ChatAdapter,
  ChatMessage,
  ChatOnFinish,
  ChatSuggestion,
  ChatUser,
  ChatVariant,
  ToolPartSlots,
} from '@mui/x-chat-headless';
import type { CopilotPanelClasses } from './copilotPanelClasses';

/**
 * Visual layout variant for the thread messages, forwarded to x-chat's
 * `ChatRoot` `variant` (consumed by `ChatMessageGroup` / `ChatMessage` via
 * `useChatVariant`).
 * - `'default'` – avatars shown, per-message timestamps, full spacing.
 * - `'compact'` – no avatars, author + timestamp in the group header, tighter
 *   bubble-style layout (matches the Data Grid Premium Copilot panel).
 */
export type CopilotMessageVariant = ChatVariant;

/**
 * A chat adapter that is guaranteed to support persistent conversation history
 * (used to drive the panel's history view).
 */
export type HistoryCapableChatAdapter = ChatAdapter &
  Required<Pick<ChatAdapter, 'listConversations' | 'listMessages'>>;

/**
 * Localizable strings rendered by the Copilot panel. Every key has an English
 * default; hosts only need to override the keys they want to translate.
 *
 * Mirrors the `copilotPanel*` / Copilot-related `getLocaleText` keys the Data
 * Grid Premium panel consumes today, generalized away from `apiRef`.
 */
export interface CopilotPanelLocaleText {
  /** Title shown in the panel header. */
  title: string;
  /** "Beta" badge label shown next to the title. */
  beta: string;
  /** Accessible label for the menu button. */
  menu: string;
  /** Accessible label for the back button. */
  back: string;
  /** Accessible label for the close button. */
  close: string;
  /** Accessible label / tooltip for the "new conversation" (reload) button. */
  reload: string;
  /** "History" section title. */
  history: string;
  /** "Session" group header in the history view. */
  session: string;
  /** "All" group header in the history view. */
  all: string;
  /** Label for the "today" relative date. */
  today: string;
  /** Label for the "yesterday" relative date. */
  yesterday: string;
  /** "View all" action label. */
  viewAll: string;
  /** "Ask" group header in the suggestions view. */
  ask: string;
  /** "More suggestions" section title. */
  moreSuggestions: string;
  /** "Settings" menu item label. */
  settings: string;
  /** "Send feedback" menu item label. */
  sendFeedback: string;
  /** "Report" menu item label. */
  report: string;
  /** Title shown in the empty-state hero. */
  emptyStateTitle: string;
  /** Helper text shown in the empty-state hero. */
  emptyStateHelper: string;
  /** Message shown when there are no conversations in history. */
  emptyConversation: string;
  /** Label for the suggestions section in the empty state. */
  suggestions: string;
  /** Label for the composer text field. */
  promptFieldLabel: string;
  /** Placeholder for the composer text field. */
  promptFieldPlaceholder: string;
  /** Accessible label for the composer send button. */
  promptFieldSend: string;
  /** Disclaimer shown below the composer. */
  disclaimer: string;
}

/**
 * Icon components rendered in the panel chrome. Each defaults to an
 * `@mui/icons-material` icon; hosts can override any of them.
 */
export interface CopilotPanelIcons {
  /** Hero icon shown in the empty state. */
  prompt?: React.ComponentType<any>;
  /** Icon for the menu button. */
  menu?: React.ComponentType<any>;
  /** Icon for the close button. */
  close?: React.ComponentType<any>;
  /** Icon for the "new conversation" / reload button. */
  newConversation?: React.ComponentType<any>;
  /** Icon for the back button (menu/history/suggestions sub-views). */
  back?: React.ComponentType<any>;
  /** Icon for the "compose new conversation" action in sub-view headers. */
  compose?: React.ComponentType<any>;
  /** Trailing chevron icon used by menu rows. */
  chevronRight?: React.ComponentType<any>;
  /** Icon for conversation/history list rows. */
  conversation?: React.ComponentType<any>;
  /** Icon for suggestion list rows. */
  suggestion?: React.ComponentType<any>;
  /** Icon for the "Settings" menu row. */
  settings?: React.ComponentType<any>;
  /** Icon for the "Send feedback" menu row. */
  feedback?: React.ComponentType<any>;
  /** Icon for the "Report" menu row. */
  report?: React.ComponentType<any>;
  /** Icon shown while speech recognition is active. */
  speechRecognition?: React.ComponentType<any>;
  /** Icon shown when speech recognition is unavailable. */
  speechRecognitionOff?: React.ComponentType<any>;
}

/** Props passed to the host-supplied `appliedChanges` slot. */
export interface CopilotChatPanelAppliedChangesProps {
  /** The assistant message whose applied changes should be rendered. */
  message: ChatMessage;
}

/** Props passed to the host-supplied `dataQueryApproval` slot. */
export interface CopilotChatPanelDataQueryApprovalProps {
  /** The tool-call id awaiting approval. */
  toolCallId: string;
}

/** Props passed to the host-supplied `abVariantTabs` slot. */
export interface CopilotChatPanelAbVariantTabsProps {
  /** The leader assistant message of the A/B pair. */
  message: ChatMessage;
  /**
   * Forwarded from the panel's `onSwitchVariant` prop: the host slot calls this
   * when the user picks a variant so the host can replay/apply it.
   */
  onSwitchVariant?(messageId: string): void;
}

/**
 * Customizes the author-name label shown above an assistant message. Either a
 * static string (e.g. the grid's `"DataGrid Copilot"`) applied to every
 * assistant message, or a resolver invoked per assistant message.
 */
export type CopilotAuthorName = string | ((message: ChatMessage) => string | undefined);

/** Props passed to the host-supplied `metadataCard` slot. */
export interface CopilotChatPanelMetadataCardProps {
  /** The assistant message whose metadata (model/cost/latency/reasoning) should be rendered. */
  message: ChatMessage;
}

/**
 * Host-specific render injections for the Copilot panel. Each entry is a
 * component the host supplies; all are optional and default to nothing in the
 * generic panel.
 */
export interface CopilotChatPanelSlots {
  /** Renders host-specific "applied changes" for an assistant message (grid: `CopilotAppliedChanges`). */
  appliedChanges?: React.ComponentType<CopilotChatPanelAppliedChangesProps>;
  /** Renders the host-specific data-query approval UI (grid: `CopilotDataQueryApproval`). */
  dataQueryApproval?: React.ComponentType<CopilotChatPanelDataQueryApprovalProps>;
  /** Renders the host-specific A/B variant tabs (grid: `CopilotAbVariantTabs`). */
  abVariantTabs?: React.ComponentType<CopilotChatPanelAbVariantTabsProps>;
  /** Renders the per-message metadata card (defaults to the generic `CopilotMessageMetadata`). */
  metadataCard?: React.ComponentType<CopilotChatPanelMetadataCardProps>;
}

/** Discriminated payload posted to the consumer-supplied feedback handler. */
export type CopilotFeedbackPayload =
  | {
      kind: 'thumbs';
      responseId: string;
      feedback: 'positive' | 'negative';
      comment?: string;
    }
  | {
      kind: 'ab-pick';
      abPairId: string;
      chosenResponseId: string;
      otherResponseId: string;
      chosenVariant: 'A' | 'B';
      comment?: string;
    };

// Handler invoked when the user submits feedback on a message.
export type CopilotFeedbackSubmit = (payload: CopilotFeedbackPayload) => Promise<void> | void;

export interface CopilotChatPanelProps {
  /** Chat adapter driving the conversation; must support history listing. */
  adapter: HistoryCapableChatAdapter;
  /**
   * Conversation to activate on mount (uncontrolled). Hosts that persist history
   * pass the last active conversation here so reopening/reloading resumes it
   * instead of starting on the empty state — e.g. Charts reads it from the
   * local-storage adapter's `getInitialActiveConversationId()`. Forwarded to the
   * panel's own `ChatRoot`; hosts that own their `ChatRoot` (the Data Grid) set
   * it there directly, so this is excluded from `CopilotChatPanelContentProps`.
   */
  initialActiveConversationId?: string;
  /**
   * Called when an assistant turn finishes, with the final message and the full
   * message list. Hosts that persist history use it to save the completed
   * exchange (the user turn is saved on send; the assistant reply only exists
   * once streaming ends) — e.g. Charts writes `messages` back to the
   * local-storage adapter. Forwarded to the panel's own `ChatRoot`; hosts that
   * own their `ChatRoot` (the Data Grid) set it there directly, so this is
   * excluded from `CopilotChatPanelContentProps`.
   */
  onFinish?: ChatOnFinish;
  /**
   * The current (human) user, forwarded to the panel's own `ChatRoot` so user
   * turns render with a branded label/avatar instead of the generic role —
   * e.g. `{ id: 'you', displayName: 'You', role: 'user' }`. Hosts that own their
   * `ChatRoot` (the Data Grid) set it there directly, so this is excluded from
   * `CopilotChatPanelContentProps`.
   */
  currentUser?: ChatUser;
  /** Whether the panel chrome is open (controls close/back affordances). */
  open?: boolean;
  /** Called when the panel requests to open or close. */
  onOpenChange?(open: boolean): void;
  /** Suggestions shown in the empty state and the "more suggestions" view. */
  suggestions?: Array<ChatSuggestion | string>;
  /** Localized strings; overrides the English defaults per key. */
  localeText?: Partial<CopilotPanelLocaleText>;
  /** Icon overrides for the panel chrome. */
  icons?: CopilotPanelIcons;
  /** Host-specific render injections. */
  slots?: CopilotChatPanelSlots;
  /**
   * Part-renderer tool slots forwarded to each message's `ChatMessageContent`
   * (keyed by tool name), so a host can render its own tool blocks — e.g. the
   * grid's `setGridState` / `runCommands` / `queryGridData` parts.
   */
  toolSlots?: Record<string, Partial<ToolPartSlots>>;
  /** Whether to render the per-message metadata card. */
  showMetadataCard?: boolean;
  /**
   * Customizes the author-name label shown above an assistant message. A static
   * string labels every assistant message (e.g. `"DataGrid Copilot"`); a
   * function resolves the label per message. When omitted, x-chat's default
   * author rendering (the message's `author.displayName` / role) is unchanged.
   */
  authorName?: CopilotAuthorName;
  /** Called when the user switches A/B variant for a message. */
  onSwitchVariant?(messageId: string): void;
  /**
   * Called when the user selects a conversation from the menu or history view.
   * When provided, the panel delegates activation to the host instead of calling
   * `setActiveConversation(id)` itself. Hosts that restore side state on
   * conversation change supply this — e.g. the Data Grid sets its controlled
   * `activeConversationId` and restores the conversation's persisted grid state.
   * When omitted (e.g. Charts), the panel activates the conversation itself.
   */
  onSelectConversation?(conversationId: string): void;
  /**
   * Called when the user starts a new conversation (header "new conversation"
   * button, or the menu/history "compose" action). When provided, the panel
   * delegates new-conversation handling to the host instead of resetting the
   * active conversation itself via `setActiveConversation(undefined)`.
   *
   * Hosts that own the conversation lifecycle supply this so their imperative
   * logic runs — e.g. the Data Grid creates a client-generated draft id, sets it
   * as the active conversation up-front, and captures baseline grid state.
   * Bypassing it (the default store reset) leaves the host's `activeConversationId`
   * unset until the next send, which can trigger a spurious history reload. When
   * omitted (e.g. Charts), the panel resets the active conversation itself.
   */
  onNewConversation?(): void;
  /**
   * Visual layout variant for the thread messages, forwarded to x-chat's
   * `ChatRoot` `variant`. `'compact'` hides avatars and uses the bubble-style
   * layout the Data Grid Premium panel ships; `'default'` keeps avatars and the
   * standard layout.
   *
   * Takes precedence over `showAvatars`. When both are omitted, x-chat's
   * `'default'` variant (avatars shown) is used — existing behavior is unchanged.
   * @default 'default'
   */
  messageVariant?: CopilotMessageVariant;
  /**
   * Convenience toggle for avatar visibility, mapped to `messageVariant` when
   * the latter is omitted (`false` → `'compact'`, `true` → `'default'`). Ignored
   * when `messageVariant` is set. When both are omitted, avatars are shown.
   */
  showAvatars?: boolean;
  /** Handler invoked when the user submits feedback on a message. */
  feedback?: CopilotFeedbackSubmit;
  /** Override or extend the styles applied to the component. */
  classes?: Partial<CopilotPanelClasses>;
  /** Class name applied to the root element. */
  className?: string;
}

/**
 * Props for `CopilotChatPanelContent` — the inner panel body, rendered inside a
 * host-provided `ChatRoot` (and optional `CopilotFeedbackProvider`). Use this
 * when the host needs `ChatRoot` capabilities the wrapper doesn't forward (e.g.
 * `onActiveConversationChange`, `density`, or mounting extra children like a
 * query-results hydrator — as the Data Grid does). For the common
 * `adapter`/`onFinish`/`initialActiveConversationId`/`currentUser` cases, prefer
 * the `CopilotChatPanel` wrapper, which forwards them to its own `ChatRoot`.
 * `adapter`/`feedback`/`currentUser` are supplied to the host's
 * `ChatRoot`/provider; `messageVariant`/`showAvatars` are set via the host's
 * `ChatRoot` `variant`, so they are not part of the content props.
 */
export type CopilotChatPanelContentProps = Omit<
  CopilotChatPanelProps,
  | 'adapter'
  | 'feedback'
  | 'messageVariant'
  | 'showAvatars'
  | 'initialActiveConversationId'
  | 'onFinish'
  | 'currentUser'
>;
