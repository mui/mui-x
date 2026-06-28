'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { createSvgIcon } from '@mui/material/utils';
import type { ChatAdapter, ChatOnFinish, ChatSuggestion, ChatUser } from '@mui/x-chat-headless';
import {
  CopilotChatPanel,
  type CopilotChatPanelProps,
  type CopilotChatPanelSlots,
  type CopilotPanelIcons,
  type CopilotPanelLocaleText,
} from '@mui/x-copilot';
import { ReceiptCard } from './ReceiptCard';

export interface ChartsCopilotPanelProps {
  /** The copilot-wrapped chat adapter returned from `useChartsCopilot`. */
  adapter: ChatAdapter;
  /**
   * Conversation to activate on mount, so reopening/reloading resumes the last
   * conversation instead of starting fresh. Read from the local-storage adapter's
   * `getInitialActiveConversationId()`.
   */
  initialActiveConversationId?: string;
  /**
   * Called when an assistant turn finishes. Hosts that persist history use it to
   * save the completed exchange (the assistant reply only exists once streaming
   * ends).
   */
  onFinish?: ChatOnFinish;
  /** Prompt suggestions shown in the empty state. Clicking one submits it. */
  suggestions?: Array<ChatSuggestion | string>;
  /** Whether the panel is open (controls the close affordance). */
  open?: boolean;
  /** Called when the panel requests to open or close (e.g. the close button). */
  onOpenChange?(open: boolean): void;
  /**
   * Called when the user starts a new conversation (the header "+" button). The
   * host owns the reset — charts reverts the chart to baseline, drops the
   * persisted active conversation, and remounts the chat — so the panel
   * delegates to this instead of its default `setActiveConversation(undefined)`
   * (a no-op here, since charts never syncs the active id into the chat store).
   */
  onNewConversation?(): void;
  /** Override or extend the styles applied to the component. */
  className?: string;
}

const DEFAULT_SUGGESTIONS: Array<ChatSuggestion | string> = [
  'Turn this into a bar chart',
  'Stack the series',
  'Summarize the data',
];

const CHART_LOCALE_TEXT: Partial<CopilotPanelLocaleText> = {
  title: 'Chart Copilot',
};

// Brand the human side of the conversation as "You" (matches the Data Grid
// Copilot) instead of the generic role label x-chat falls back to.
const CHART_CURRENT_USER: ChatUser = { id: 'you', displayName: 'You', role: 'user' };

// Match the Data Grid Copilot look: a "+" new-conversation icon.
const AddIcon = createSvgIcon(<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />, 'ChartCopilotAdd');

(AddIcon as any).propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   * You can use the `htmlColor` prop to apply a color attribute to the SVG element.
   * @default 'inherit'
   */
  color: PropTypes.oneOf([
    'action',
    'disabled',
    'error',
    'info',
    'inherit',
    'primary',
    'secondary',
    'success',
    'warning',
  ]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The fontSize applied to the icon. Defaults to 24px, but can be configure to inherit font size.
   * @default 'medium'
   */
  fontSize: PropTypes.oneOf(['inherit', 'large', 'medium', 'small']),
  /**
   * Applies a color attribute to the SVG element.
   */
  htmlColor: PropTypes.string,
  /**
   * If `true`, the root node will inherit the custom `component`'s viewBox and the `viewBox`
   * prop will be ignored.
   * Useful when you want to reference a custom `component` and have `SvgIcon` pass that
   * `component`'s viewBox to the root node.
   * @default false
   */
  inheritViewBox: PropTypes.bool,
  /**
   * The shape-rendering attribute. The behavior of the different options is described on the
   * [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/shape-rendering).
   * If you are having issues with blurry icons you should investigate this prop.
   */
  shapeRendering: PropTypes.string,
  style: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Provides a human-readable title for the element that contains it.
   * https://www.w3.org/TR/SVG-access/#Equivalent
   */
  titleAccess: PropTypes.string,
  /**
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * For example, if the SVG element is 500 (width) by 200 (height),
   * and you pass viewBox="0 0 50 20",
   * this means that the coordinates inside the SVG will go from the top left corner (0,0)
   * to bottom right (50,20) and each unit will be worth 10px.
   * @default '0 0 24 24'
   */
  viewBox: PropTypes.string,
} as any;

const CHART_ICONS: CopilotPanelIcons = {
  newConversation: AddIcon,
};

// Render the per-turn receipt (what the AI did + undo) under each assistant
// message, in place of the generic metadata card.
const CHART_PANEL_SLOTS: CopilotChatPanelSlots = {
  metadataCard: ReceiptCard,
};

// The chart patch tool is presented to the chat UI as `updateChart` (see
// `CHARTS_TOOL_NAME_ALIASES` in `useChartsCopilot`). It applies immediately and
// is already summarized by the `ReceiptCard` rendered under the message, so
// suppress x-chat's default tool block — otherwise the conversation shows a raw
// "updateChart / Completed" header with a dumped JSON patch above the receipt.
// Returning `null` from the `root` slot replaces (and therefore hides) the
// default block.
function SuppressedToolBlock(): null {
  return null;
}

const CHART_TOOL_SLOTS: NonNullable<CopilotChatPanelProps['toolSlots']> = {
  updateChart: { root: SuppressedToolBlock },
};

/**
 * Chat surface for the Charts Copilot — a thin charts-branded wrapper around the
 * shared `@mui/x-copilot` `CopilotChatPanel`. Charts gets conversation history,
 * the post-turn suggestion strip, per-message metadata, and the full panel
 * chrome for free. The copilot adapter from `useChartsCopilot` already exposes
 * `listConversations`/`listMessages` (via the local-storage adapter), so it
 * satisfies the panel's history-capable contract at runtime; the cast bridges
 * the structurally-optional `ChatAdapter` type to the panel's required shape.
 */
export function ChartsCopilotPanel(props: ChartsCopilotPanelProps) {
  const {
    adapter,
    initialActiveConversationId,
    onFinish,
    suggestions = DEFAULT_SUGGESTIONS,
    open,
    onOpenChange,
    onNewConversation,
    className,
  } = props;

  return (
    <CopilotChatPanel
      adapter={adapter as CopilotChatPanelProps['adapter']}
      initialActiveConversationId={initialActiveConversationId}
      onFinish={onFinish}
      currentUser={CHART_CURRENT_USER}
      open={open}
      onOpenChange={onOpenChange}
      onNewConversation={onNewConversation}
      suggestions={suggestions}
      localeText={CHART_LOCALE_TEXT}
      icons={CHART_ICONS}
      slots={CHART_PANEL_SLOTS}
      toolSlots={CHART_TOOL_SLOTS}
      messageVariant="compact"
      authorName="Chart Copilot"
      className={className}
    />
  );
}
