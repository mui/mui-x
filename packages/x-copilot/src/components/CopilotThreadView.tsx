'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { ChatMessageList, ChatScrollToBottomAffordance } from '@mui/x-chat';
import type { ChatSuggestion, ToolPartSlots } from '@mui/x-chat-headless';
import { useMessageIds } from '@mui/x-chat-headless';
import { CopilotEmptyState } from './CopilotEmptyState';
import { CopilotTurnSpacer } from './CopilotTurnSpacer';
import { CopilotMessageItem } from './CopilotMessageItem';
import { useCopilotPanelUtilityClasses, type CopilotPanelClasses } from './copilotPanelClasses';
import type {
  CopilotAuthorName,
  CopilotChatPanelAbVariantTabsProps,
  CopilotChatPanelMetadataCardProps,
  CopilotPanelIcons,
  CopilotPanelLocaleText,
} from './CopilotChatPanel.types';

const ThreadRoot = styled('div', {
  name: 'MuiCopilotThreadView',
  slot: 'Root',
})({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const ThreadBody = styled('div', {
  name: 'MuiCopilotThreadView',
  slot: 'Body',
})({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
});

// Custom messageListContent slot that appends a dynamic spacer after the
// rendered rows. The spacer claims one viewport-worth of vertical space after
// the most recent user message so submitting a new prompt scrolls it cleanly to
// the top of the visible area, leaving room below for the assistant response.
const ThreadMessageListContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { ownerState?: unknown }
>(function ThreadMessageListContent(props, ref) {
  const { children, ownerState, ...rest } = props;
  void ownerState;
  return (
    <div ref={ref} {...rest}>
      {children}
      <CopilotTurnSpacer />
    </div>
  );
});

ThreadMessageListContent.propTypes = {
  ownerState: PropTypes.any,
} as any;

export interface CopilotThreadViewProps {
  /** Suggestions rendered in the empty-state hero (before the first message). */
  suggestions?: Array<ChatSuggestion | string>;
  /** Localized strings; only the empty-state keys are read here. */
  localeText?: Partial<CopilotPanelLocaleText>;
  /** Icon overrides; only the empty-state hero icon (`prompt`) is read here. */
  icons?: CopilotPanelIcons;
  /**
   * Part-renderer tool slots forwarded to each message (e.g. the grid's
   * `setGridState` / `queryGridData` blocks). Host-agnostic by default.
   */
  toolSlots?: Record<string, Partial<ToolPartSlots>>;
  /**
   * Host-supplied A/B variant tabs, forwarded to each message. Defaults to
   * nothing (no A/B rendering).
   */
  abVariantTabs?: React.ComponentType<CopilotChatPanelAbVariantTabsProps>;
  /** Forwarded to the A/B-tabs slot so it can apply the picked variant. */
  onSwitchVariant?(messageId: string): void;
  /**
   * Per-message metadata card, forwarded to each message. Defaults to the
   * generic `CopilotMessageMetadata`; pass `null` to render no card.
   */
  metadataCard?: React.ComponentType<CopilotChatPanelMetadataCardProps> | null;
  /**
   * Customizes the author-name label shown above assistant messages, forwarded
   * to each message. When omitted, x-chat's default author rendering is unchanged.
   */
  authorName?: CopilotAuthorName;
  /** Override or extend the styles applied to the component. */
  classes?: Partial<CopilotPanelClasses>;
  /** Class name applied to the root element. */
  className?: string;
}

/**
 * Generic, host-agnostic thread view for the Copilot panel: an auto-scrolling
 * message list (composed from x-chat's `ChatMessageList`), a scroll-to-bottom
 * affordance, and an empty-state hero with suggestions shown before the first
 * message. Each row is a `CopilotMessageItem`; host-specific blocks (A/B tabs,
 * metadata card, tool slots) are injected via props, never imported.
 */
function CopilotThreadView(props: CopilotThreadViewProps) {
  const {
    suggestions,
    localeText,
    icons,
    toolSlots,
    abVariantTabs,
    onSwitchVariant,
    metadataCard,
    authorName,
    classes: classesProp,
    className,
  } = props;
  const classes = useCopilotPanelUtilityClasses(classesProp);
  const messageIds = useMessageIds();

  const renderItem = React.useCallback(
    (params: { id: string }) => (
      <CopilotMessageItem
        id={params.id}
        toolSlots={toolSlots}
        abVariantTabs={abVariantTabs}
        onSwitchVariant={onSwitchVariant}
        metadataCard={metadataCard}
        authorName={authorName}
        classes={classesProp}
      />
    ),
    [toolSlots, abVariantTabs, onSwitchVariant, metadataCard, authorName, classesProp],
  );

  return (
    <ThreadRoot className={clsx(classes.thread, className)}>
      <ThreadBody className={classes.body}>
        <ChatMessageList
          items={messageIds}
          renderItem={renderItem}
          autoScroll
          overlay={
            <React.Fragment>
              {messageIds.length === 0 && (
                <CopilotEmptyState
                  localeText={localeText}
                  icons={icons}
                  suggestions={suggestions?.slice(0, 3)}
                  autoSubmit
                />
              )}
              <ChatScrollToBottomAffordance />
            </React.Fragment>
          }
          sx={{
            backgroundColor: 'transparent',
            '& .MuiChatMessageList-content': {
              paddingBlock: 1,
            },
          }}
          slots={{
            messageListContent: ThreadMessageListContent,
          }}
          slotProps={{
            messageListOverlay: {
              style: {
                top: 0,
                display: 'flex',
              },
            } as any,
          }}
        />
      </ThreadBody>
    </ThreadRoot>
  );
}

export { CopilotThreadView };
