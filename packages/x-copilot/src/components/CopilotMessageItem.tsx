'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageMeta,
} from '@mui/x-chat';
import { type ChatMessage, type ToolPartSlots, useMessage } from '@mui/x-chat-headless';
import { CopilotStreamingIndicator } from './CopilotStreamingIndicator';
import { CopilotMessageMetadata } from './CopilotMessageMetadata';
import { CopilotMessageFooter } from './CopilotMessageFooter';
import { useCopilotPanelUtilityClasses, type CopilotPanelClasses } from './copilotPanelClasses';
import type {
  CopilotAuthorName,
  CopilotChatPanelAbVariantTabsProps,
  CopilotChatPanelMetadataCardProps,
} from './CopilotChatPanel.types';

export interface CopilotMessageItemProps {
  /** Id of the message to render (looked up in the surrounding chat store). */
  id: string;
  /**
   * Part-renderer tool slots forwarded to `ChatMessageContent` so hosts can
   * style/extend individual tool blocks (e.g. the grid's `setGridState`).
   */
  toolSlots?: Record<string, Partial<ToolPartSlots>>;
  /**
   * Host-supplied A/B variant tabs. When provided and the message is an A/B
   * leader, this renders in place of the standard bubble; the host owns the
   * pair-detection / follower-suppression logic. Defaults to nothing.
   */
  abVariantTabs?: React.ComponentType<CopilotChatPanelAbVariantTabsProps>;
  /** Forwarded to the A/B-tabs slot so it can apply the picked variant. */
  onSwitchVariant?(messageId: string): void;
  /**
   * Per-message metadata card (model / cost / latency). Defaults to the generic
   * `CopilotMessageMetadata`. Pass `null` to render no card.
   */
  metadataCard?: React.ComponentType<CopilotChatPanelMetadataCardProps> | null;
  /**
   * Customizes the author-name label shown above an assistant message. When
   * omitted, x-chat's default author rendering is unchanged.
   */
  authorName?: CopilotAuthorName;
  /** Override or extend the styles applied to the component. */
  classes?: Partial<CopilotPanelClasses>;
  /** Class name applied to the root element. */
  className?: string;
}

// Owner state x-chat's `MessageGroup` passes to the `authorName` slot.
interface CopilotAuthorNameOwnerState {
  authorRole?: string;
  variant?: string;
}

// Mirrors x-chat's internal default author-name styling (caption, medium weight,
// avatar-width offset, primary color + flex layout in the compact variant) so an
// `authorName` override keeps pixel parity with the default rendering.
const CopilotAuthorNameRoot = styled('div', {
  name: 'MuiCopilotMessageItem',
  slot: 'AuthorName',
})<{ ownerState?: CopilotAuthorNameOwnerState }>(({ theme, ownerState }) => {
  const base = {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    color: (theme.vars || theme).palette.text.secondary,
    marginBottom: 0,
  };
  if (ownerState?.variant === 'compact') {
    return {
      ...base,
      gridArea: 'authorName',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing(1),
      lineHeight: 1,
      color: (theme.vars || theme).palette.primary.main,
    };
  }
  const offset = `calc(var(--MuiChatMessage-avatarSize) + ${theme.spacing(2)} + ${theme.spacing(0.5)})`;
  if (ownerState?.authorRole === 'user') {
    return { ...base, textAlign: 'right' as const, paddingInlineEnd: offset };
  }
  return { ...base, paddingInlineStart: offset };
});

/**
 * Builds the `authorName` slot forwarded to x-chat's `ChatMessageGroup`. For
 * assistant messages it swaps the default label for the resolved `authorName`
 * (static string or per-message resolver); every other role keeps the default
 * label x-chat passes as `children`. Returns `undefined` when no override is
 * supplied so x-chat's default author rendering stays untouched.
 */
function useCopilotAuthorNameSlot(
  authorName: CopilotAuthorName | undefined,
  message: ChatMessage | undefined,
): React.ElementType | undefined {
  return React.useMemo(() => {
    if (authorName === undefined) {
      return undefined;
    }
    let resolved: string | undefined;
    if (typeof authorName === 'function') {
      resolved = message ? authorName(message) : undefined;
    } else {
      resolved = authorName;
    }

    function CopilotAuthorNameSlot(props: {
      ownerState?: CopilotAuthorNameOwnerState;
      children?: React.ReactNode;
    }) {
      const { ownerState, children, ...rest } = props;
      const isAssistant = ownerState?.authorRole === 'assistant';
      const label = isAssistant && resolved != null ? resolved : children;
      return (
        <CopilotAuthorNameRoot ownerState={ownerState} {...rest}>
          {label}
        </CopilotAuthorNameRoot>
      );
    }

    return CopilotAuthorNameSlot;
  }, [authorName, message]);
}

/**
 * Renders a single message in the Copilot thread: content + reasoning (via
 * x-chat's `ChatMessageContent`), the streaming indicator, and the per-message
 * metadata card + feedback footer.
 *
 * Host-specific blocks are injected, never imported: when an `abVariantTabs`
 * component is supplied and reports a render for this message, it replaces the
 * standard bubble; otherwise the message renders normally. The metadata card is
 * itself an injection point defaulting to the generic `CopilotMessageMetadata`.
 */
function CopilotMessageItem(props: CopilotMessageItemProps) {
  const {
    id,
    toolSlots,
    abVariantTabs: AbVariantTabs,
    onSwitchVariant,
    metadataCard,
    authorName,
    classes: classesProp,
    className,
  } = props;
  const classes = useCopilotPanelUtilityClasses(classesProp);
  // Reactive read: `useMessage` subscribes to the store so the metadata card +
  // A/B detection re-render as the message streams / finishes (vs a one-shot
  // `store.state` snapshot, which would go stale during streaming).
  const message = useMessage(id) ?? undefined;
  const authorNameSlot = useCopilotAuthorNameSlot(authorName, message);

  // A/B-pair messages defer entirely to the host-supplied tabs. The host owns
  // the pair-detection + follower-suppression logic; it returns `null` for the
  // follower so the tabbed card stays in the leader's chronological slot.
  const abPairId = message?.metadata?.abPairId;
  if (abPairId && AbVariantTabs && message) {
    return <AbVariantTabs message={message} onSwitchVariant={onSwitchVariant} />;
  }

  // `metadataCard` is an injection point: `undefined` → generic card,
  // `null` → no card. The generic card no-ops unless `?expose-metadata=1`.
  // The default card carries the panel's `metadata` class hook so hosts can
  // theme it; host slots own their own styling.
  const HostMetadataCard = metadataCard;
  let metadataCardNode: React.ReactNode = null;
  if (metadataCard === undefined) {
    metadataCardNode = (
      <CopilotMessageMetadata message={message ?? null} className={classes.metadata} />
    );
  } else if (HostMetadataCard && message) {
    metadataCardNode = <HostMetadataCard message={message} />;
  }

  return (
    <ChatMessageGroup
      messageId={id}
      className={clsx(classes.message, className)}
      slots={authorNameSlot ? { authorName: authorNameSlot } : undefined}
    >
      <ChatMessageComponent messageId={id}>
        <ChatMessageContent
          afterContent={
            <React.Fragment>
              <CopilotStreamingIndicator />
              {metadataCardNode}
              <CopilotMessageFooter />
            </React.Fragment>
          }
          partProps={toolSlots ? { tool: { toolSlots } } : undefined}
        />
        <ChatMessageMeta />
      </ChatMessageComponent>
    </ChatMessageGroup>
  );
}

export { CopilotMessageItem };
