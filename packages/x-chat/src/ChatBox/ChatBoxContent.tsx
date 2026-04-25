'use client';
import * as React from 'react';
import { useChat, useMessage, useMessageIds, useConversations } from '@mui/x-chat-headless';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MUIFocusTrap from '@mui/material/Unstable_TrapFocus';
import {
  ChatLayout,
  useChatLocaleText,
  useChatVariant,
  type ChatSuggestion,
  type ChatVariant,
} from '@mui/x-chat-headless';
import { styled } from '../internals/zero-styled';
import { ChatConversation } from '../ChatConversation/ChatConversation';
import { ChatConversationHeader } from '../ChatConversation/ChatConversationHeader';
import { ChatConversationTitle } from '../ChatConversation/ChatConversationTitle';
import { ChatConversationSubtitle } from '../ChatConversation/ChatConversationSubtitle';
import { ChatConversationHeaderInfo } from '../ChatConversation/ChatConversationHeaderInfo';
import { ChatConversationHeaderActions } from '../ChatConversation/ChatConversationHeaderActions';
import { ChatConversationList } from '../ChatConversationList/ChatConversationList';
import { ChatComposer } from '../ChatComposer/ChatComposer';
import { ChatComposerTextArea } from '../ChatComposer/ChatComposerTextArea';
import { ChatComposerSendButton } from '../ChatComposer/ChatComposerSendButton';
import { ChatComposerAttachButton } from '../ChatComposer/ChatComposerAttachButton';
import { ChatComposerAttachmentList } from '../ChatComposer/ChatComposerAttachmentList';
import { ChatComposerToolbar } from '../ChatComposer/ChatComposerToolbar';
import { ChatComposerHelperText } from '../ChatComposer/ChatComposerHelperText';
import { ChatMessageList } from '../ChatMessageList/ChatMessageList';
import { ChatMessageGroup } from '../ChatMessage/ChatMessageGroup';
import { ChatMessageContent } from '../ChatMessage/ChatMessageContent';
import { ChatMessageMeta } from '../ChatMessage/ChatMessageMeta';
import { ChatMessageAvatar } from '../ChatMessage/ChatMessageAvatar';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { ChatMessageActions } from '../ChatMessage/ChatMessageActions';
import { ChatMessageInlineMeta } from '../ChatMessage/ChatMessageInlineMeta';
import { ChatScrollToBottomAffordance } from '../ChatIndicators/ChatScrollToBottomAffordance';
import { ChatSuggestions } from '../ChatSuggestions/ChatSuggestions';
import type {
  ChatBoxSlots,
  ChatBoxSlotProps,
  ChatBoxFeatures,
  ChatBoxLayoutMode,
  ChatBoxLayoutModeBreakpoints,
} from './ChatBox.types';
import DefaultSendIcon from '../icons/DefaultSendIcon';
import DefaultAttachIcon from '../icons/DefaultAttachIcon';
import DefaultMenuIcon from '../icons/DefaultMenuIcon';
import DefaultCloseIcon from '../icons/DefaultCloseIcon';

const DEFAULT_OVERLAY_BREAKPOINT = 600;
const DEFAULT_SPLIT_BREAKPOINT = 450;

/**
 * Observes the ChatBox root element's inline size so the JS behavior
 * can stay aligned with container-query-driven layout changes.
 */
function useContainerWidth(ref: React.RefObject<HTMLElement | null>): number | null {
  const [width, setWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) {
      return undefined;
    }

    const updateWidth = (nextWidth: number) => {
      setWidth(nextWidth);
    };

    const initialWidth = el.getBoundingClientRect().width;
    if (initialWidth > 0) {
      updateWidth(initialWidth);
    }

    if (typeof globalThis.ResizeObserver === 'undefined') {
      return undefined;
    }

    const ro = new globalThis.ResizeObserver((entries) => {
      for (const entry of entries) {
        const borderBoxSize = Array.isArray(entry.borderBoxSize)
          ? entry.borderBoxSize[0]
          : entry.borderBoxSize;
        const contentBoxSize = Array.isArray(entry.contentBoxSize)
          ? entry.contentBoxSize[0]
          : entry.contentBoxSize;
        const nextWidth =
          borderBoxSize?.inlineSize ?? contentBoxSize?.inlineSize ?? entry.contentRect.width;
        updateWidth(nextWidth);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return width;
}

const ChatBoxEmptyState = styled('div', {
  name: 'MuiChatBox',
  slot: 'EmptyState',
})(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  color: (theme.vars || theme).palette.text.secondary,
  padding: theme.spacing(4),
  userSelect: 'none',
  pointerEvents: 'none',
}));

const ChatBoxEmptyStateIcon = styled('svg', {
  name: 'MuiChatBox',
  slot: 'EmptyStateIcon',
})(({ theme }) => ({
  width: 48,
  height: 48,
  color: (theme.vars || theme).palette.action.disabled,
  marginBottom: theme.spacing(1),
}));

const ChatBoxEmptyStateTitle = styled('p', {
  name: 'MuiChatBox',
  slot: 'EmptyStateTitle',
})(({ theme }) => ({
  margin: 0,
  ...theme.typography.subtitle1,
  color: (theme.vars || theme).palette.text.secondary,
}));

const ChatBoxEmptyStateHelper = styled('p', {
  name: 'MuiChatBox',
  slot: 'EmptyStateHelper',
})(({ theme }) => ({
  margin: 0,
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.disabled,
}));

const ChatBoxDrawerContent = styled('div', {
  name: 'MuiChatBox',
  slot: 'DrawerContent',
})({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
});

const ChatBoxDrawerHeader = styled('div', {
  name: 'MuiChatBox',
  slot: 'DrawerHeader',
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: theme.spacing(1, 1, 0.5),
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

const ChatBoxConversationOverlay = styled('div', {
  name: 'MuiChatBox',
  slot: 'ConversationOverlay',
})({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
});

const ChatBoxConversationOverlayBackdrop = styled('button', {
  name: 'MuiChatBox',
  slot: 'ConversationOverlayBackdrop',
})(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  border: 0,
  margin: 0,
  padding: 0,
  backgroundColor: (theme.vars || theme).palette.action.disabledBackground,
  cursor: 'pointer',
  pointerEvents: 'auto',
}));

const ChatBoxConversationOverlayPanel = styled('div', {
  name: 'MuiChatBox',
  slot: 'ConversationOverlayPanel',
})({
  position: 'absolute',
  insetBlock: 0,
  insetInlineStart: 0,
  height: '100%',
  maxWidth: '100%',
  pointerEvents: 'auto',
});

const DefaultBackIcon = React.memo(function DefaultBackIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: '1em', height: '1em' }}
    >
      <path d="M20 11H7.83l5.58-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" />
    </svg>
  );
});

interface ChatBoxContentProps {
  variant?: ChatVariant;
  slots?: Partial<ChatBoxSlots>;
  slotProps?: ChatBoxSlotProps;
  features?: ChatBoxFeatures;
  layoutMode?: ChatBoxLayoutMode;
  layoutModeBreakpoints?: Partial<ChatBoxLayoutModeBreakpoints>;
  rootRef: React.RefObject<HTMLElement | null>;
  layoutClassName?: string;
  conversationsPaneClassName?: string;
  threadPaneClassName?: string;
  suggestions?: Array<ChatSuggestion | string>;
  suggestionsAutoSubmit?: boolean;
}

function normalizeLayoutModeBreakpoints(
  breakpoints?: Partial<ChatBoxLayoutModeBreakpoints>,
): ChatBoxLayoutModeBreakpoints {
  const overlay = breakpoints?.overlay ?? DEFAULT_OVERLAY_BREAKPOINT;
  const split = Math.min(breakpoints?.split ?? DEFAULT_SPLIT_BREAKPOINT, overlay);

  return { overlay, split };
}

function DefaultMessageItem({
  id,
  slots,
  slotProps,
}: {
  id: string;
  slots?: Partial<ChatBoxSlots>;
  slotProps?: ChatBoxSlotProps;
  features?: ChatBoxFeatures;
}) {
  const variant = useChatVariant();
  const message = useMessage(id);
  const MessageGroupComponent = (slots?.messageGroup ??
    ChatMessageGroup) as typeof ChatMessageGroup;
  const MessageAvatarComponent = (slots?.messageAvatar ??
    ChatMessageAvatar) as typeof ChatMessageAvatar;
  const MessageContentComponent = (slots?.messageContent ??
    ChatMessageContent) as typeof ChatMessageContent;
  const MessageMetaComponent = (slots?.messageMeta ?? ChatMessageMeta) as typeof ChatMessageMeta;
  const MessageRootComponent = (slots?.messageRoot ?? ChatMessage) as typeof ChatMessage;
  const MessageActionsSlot = slots?.messageActions;

  const isDefault = variant !== 'compact';
  const isStreaming = message?.status === 'streaming';

  // Default variant: inline meta inside the bubble (Telegram-style).
  // Skip during streaming — there is no timestamp yet, and the streaming state
  // is already communicated via the MuiChatMessage-streaming CSS class.
  // Also skip when the message carries no displayable meta at all (no timestamp,
  // no edited label, no delivery status) so the spacer does not add dead space.
  const hasMeta =
    Boolean(message?.createdAt) || Boolean(message?.editedAt) || Boolean(message?.status);
  const inlineMeta = isDefault && !isStreaming && hasMeta ? <ChatMessageInlineMeta /> : undefined;

  return (
    <MessageGroupComponent messageId={id} {...(slotProps?.messageGroup ?? {})}>
      <MessageRootComponent messageId={id} {...(slotProps?.messageRoot ?? {})}>
        <MessageAvatarComponent {...(slotProps?.messageAvatar ?? {})} />
        <MessageContentComponent {...(slotProps?.messageContent ?? {})} afterContent={inlineMeta} />
        {/* External meta is only used in the compact variant */}
        {!isDefault && <MessageMetaComponent {...(slotProps?.messageMeta ?? {})} />}
        {MessageActionsSlot && (
          <ChatMessageActions {...(slotProps?.messageActions ?? {})}>
            <MessageActionsSlot messageId={id} />
          </ChatMessageActions>
        )}
      </MessageRootComponent>
    </MessageGroupComponent>
  );
}

function DefaultConversationHeader({
  slots,
  slotProps,
  features,
  onBackClick,
  showBackButton,
  onMenuClick,
  showMenuButton,
}: {
  slots?: Partial<ChatBoxSlots>;
  slotProps?: ChatBoxSlotProps;
  features?: ChatBoxFeatures;
  onBackClick?: () => void;
  showBackButton?: boolean;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}) {
  const localeText = useChatLocaleText();

  if (features?.conversationHeader === false) {
    return null;
  }
  const ConversationHeaderComponent = (slots?.conversationHeader ??
    ChatConversationHeader) as typeof ChatConversationHeader;
  const ConversationHeaderInfoComponent = (slots?.conversationHeaderInfo ??
    ChatConversationHeaderInfo) as typeof ChatConversationHeaderInfo;
  const ConversationTitleComponent = (slots?.conversationTitle ??
    ChatConversationTitle) as typeof ChatConversationTitle;
  const ConversationSubtitleComponent = (slots?.conversationSubtitle ??
    ChatConversationSubtitle) as typeof ChatConversationSubtitle;
  const ConversationHeaderActionsComponent = (slots?.conversationHeaderActions ??
    ChatConversationHeaderActions) as typeof ChatConversationHeaderActions;

  return (
    <ConversationHeaderComponent {...(slotProps?.conversationHeader ?? {})}>
      {showBackButton && (
        <Tooltip title={localeText.conversationHeaderBackLabel}>
          <IconButton
            size="small"
            aria-label={localeText.conversationHeaderBackLabel}
            onClick={onBackClick}
            sx={{ mr: 1 }}
          >
            <DefaultBackIcon />
          </IconButton>
        </Tooltip>
      )}
      {showMenuButton && (
        <Tooltip title={localeText.conversationHeaderMenuLabel}>
          <IconButton
            size="small"
            aria-label={localeText.conversationHeaderMenuLabel}
            onClick={onMenuClick}
            sx={{ mr: 1 }}
          >
            <DefaultMenuIcon />
          </IconButton>
        </Tooltip>
      )}
      <ConversationHeaderInfoComponent {...(slotProps?.conversationHeaderInfo ?? {})}>
        <ConversationTitleComponent {...(slotProps?.conversationTitle ?? {})} />
        <ConversationSubtitleComponent {...(slotProps?.conversationSubtitle ?? {})} />
      </ConversationHeaderInfoComponent>
      <ConversationHeaderActionsComponent {...(slotProps?.conversationHeaderActions ?? {})} />
    </ConversationHeaderComponent>
  );
}

function mergeConversationListItemSlotProps(itemSlotProps: any, handleDrawerClose: () => void) {
  return (params: any) => {
    const externalProps =
      typeof itemSlotProps === 'function' ? itemSlotProps(params) : (itemSlotProps ?? {});

    return {
      ...externalProps,
      onClick: (event: React.MouseEvent) => {
        externalProps?.onClick?.(event);
        handleDrawerClose();
      },
    };
  };
}

function mergeConversationListLayoutSlotProps(slotProp: any, extraStyle: React.CSSProperties) {
  return (ownerState: any) => {
    const externalProps = typeof slotProp === 'function' ? slotProp(ownerState) : (slotProp ?? {});

    return {
      ...externalProps,
      style: {
        ...extraStyle,
        ...(externalProps?.style ?? {}),
      },
    };
  };
}

function createConversationListSlotProps(
  baseSlotProps: any,
  options: {
    fullWidth?: boolean;
    onItemClick?: () => void;
  } = {},
) {
  return {
    ...baseSlotProps,
    root: mergeConversationListLayoutSlotProps(baseSlotProps?.root, {
      flex: 1,
      minHeight: 0,
    }),
    scroller: mergeConversationListLayoutSlotProps(baseSlotProps?.scroller, {
      display: 'flex',
      flex: 1,
      minHeight: 0,
      width: '100%',
      borderRight: 0,
      ...(options.fullWidth ? { maxWidth: '100%' } : {}),
    }),
    viewport: mergeConversationListLayoutSlotProps(baseSlotProps?.viewport, {
      flex: 1,
      minHeight: 0,
    }),
    ...(options.onItemClick
      ? {
          item: mergeConversationListItemSlotProps(baseSlotProps?.item, options.onItemClick),
        }
      : {}),
  };
}

function DefaultComposer({
  slots,
  slotProps,
  features,
}: {
  slots?: Partial<ChatBoxSlots>;
  slotProps?: ChatBoxSlotProps;
  features?: ChatBoxFeatures;
}) {
  const contextVariant = useChatVariant();
  const variant = slotProps?.composerRoot?.variant ?? contextVariant;
  const showAttachments = features?.attachments !== false;
  const showHelperText = features?.helperText !== false;
  const attachmentConfig =
    typeof features?.attachments === 'object' ? features.attachments : undefined;
  const ComposerRootComponent = (slots?.composerRoot ?? ChatComposer) as typeof ChatComposer;
  const ComposerInputComponent = (slots?.composerInput ??
    ChatComposerTextArea) as typeof ChatComposerTextArea;
  const ComposerToolbarComponent = (slots?.composerToolbar ??
    ChatComposerToolbar) as typeof ChatComposerToolbar;
  const ComposerSendButtonComponent = (slots?.composerSendButton ??
    ChatComposerSendButton) as typeof ChatComposerSendButton;
  const ComposerAttachButtonComponent = (slots?.composerAttachButton ??
    ChatComposerAttachButton) as typeof ChatComposerAttachButton;
  const ComposerAttachmentListComponent = (slots?.composerAttachmentList ??
    ChatComposerAttachmentList) as typeof ChatComposerAttachmentList;
  const ComposerHelperTextComponent = (slots?.composerHelperText ??
    ChatComposerHelperText) as typeof ChatComposerHelperText;
  const localeText = useChatLocaleText();

  if (variant === 'compact') {
    return (
      <ComposerRootComponent
        variant="compact"
        attachmentConfig={attachmentConfig}
        {...(slotProps?.composerRoot ?? {})}
      >
        {showAttachments && (
          <ComposerAttachmentListComponent {...(slotProps?.composerAttachmentList ?? {})} />
        )}
        {showAttachments && (
          <ComposerAttachButtonComponent
            aria-label={localeText.composerAttachButtonLabel}
            {...(slotProps?.composerAttachButton ?? {})}
          >
            <DefaultAttachIcon />
          </ComposerAttachButtonComponent>
        )}
        <ComposerInputComponent
          maxRows={5}
          placeholder={localeText.composerInputPlaceholder}
          {...(slotProps?.composerInput ?? {})}
        />
        <ComposerSendButtonComponent
          aria-label={localeText.composerSendButtonLabel}
          {...(slotProps?.composerSendButton ?? {})}
        >
          <DefaultSendIcon />
        </ComposerSendButtonComponent>
      </ComposerRootComponent>
    );
  }

  return (
    <ComposerRootComponent attachmentConfig={attachmentConfig} {...(slotProps?.composerRoot ?? {})}>
      {showAttachments && (
        <ComposerAttachmentListComponent {...(slotProps?.composerAttachmentList ?? {})} />
      )}
      <ComposerInputComponent
        placeholder={localeText.composerInputPlaceholder}
        {...(slotProps?.composerInput ?? {})}
      />
      {showHelperText && <ComposerHelperTextComponent {...(slotProps?.composerHelperText ?? {})} />}
      <ComposerToolbarComponent {...(slotProps?.composerToolbar ?? {})}>
        {showAttachments && (
          <ComposerAttachButtonComponent
            aria-label={localeText.composerAttachButtonLabel}
            {...(slotProps?.composerAttachButton ?? {})}
          >
            <DefaultAttachIcon />
          </ComposerAttachButtonComponent>
        )}
        <ComposerSendButtonComponent
          aria-label={localeText.composerSendButtonLabel}
          {...(slotProps?.composerSendButton ?? {})}
        >
          <DefaultSendIcon />
        </ComposerSendButtonComponent>
      </ComposerToolbarComponent>
    </ComposerRootComponent>
  );
}

export function ChatBoxContent(props: ChatBoxContentProps) {
  const {
    variant,
    slots,
    slotProps,
    features,
    layoutMode,
    layoutModeBreakpoints,
    rootRef,
    layoutClassName,
    conversationsPaneClassName,
    threadPaneClassName,
    suggestions,
    suggestionsAutoSubmit,
  } = props;
  const showScrollToBottom = features?.scrollToBottom !== false;
  const showSuggestions =
    features?.suggestions !== false && !!suggestions && suggestions.length > 0;

  const autoScrollProp = features?.autoScroll ?? true;
  const { activeConversationId, setActiveConversation } = useChat();

  const containerWidth = useContainerWidth(rootRef);
  const normalizedBreakpoints = React.useMemo(
    () => normalizeLayoutModeBreakpoints(layoutModeBreakpoints),
    [layoutModeBreakpoints],
  );
  const resolvedLayoutMode = React.useMemo<ChatBoxLayoutMode>(() => {
    if (layoutMode != null) {
      return layoutMode;
    }

    if (containerWidth == null) {
      return 'standard';
    }

    if (containerWidth < normalizedBreakpoints.split) {
      return 'split';
    }

    if (containerWidth < normalizedBreakpoints.overlay) {
      return 'overlay';
    }

    return 'standard';
  }, [containerWidth, layoutMode, normalizedBreakpoints]);
  const isNarrow = resolvedLayoutMode !== 'standard';
  const isFullWidthDrawer =
    containerWidth == null ? false : containerWidth < normalizedBreakpoints.split;
  const isMobileSplitView = resolvedLayoutMode === 'split';
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const drawerCloseButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const drawerOpenerRef = React.useRef<HTMLElement | null>(null);
  const wasDrawerOpenRef = React.useRef(false);
  const messageIds = useMessageIds();
  const conversations = useConversations();
  const localeText = useChatLocaleText();
  const hasConversationList = conversations.length > 0;

  const restoreDrawerFocus = React.useCallback(() => {
    const drawerOpener = drawerOpenerRef.current;
    drawerOpenerRef.current = null;

    if (drawerOpener && globalThis.document?.contains(drawerOpener)) {
      drawerOpener.focus();
    }
  }, []);

  const handleMenuClick = React.useCallback(() => {
    drawerOpenerRef.current =
      globalThis.document?.activeElement instanceof HTMLElement
        ? globalThis.document.activeElement
        : null;
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = React.useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleDrawerKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.stopPropagation();
      handleDrawerClose();
    },
    [handleDrawerClose],
  );

  const handleBackClick = React.useCallback(() => {
    void setActiveConversation(undefined);
  }, [setActiveConversation]);

  React.useEffect(() => {
    if (!isNarrow || isMobileSplitView) {
      setDrawerOpen(false);
    }
  }, [isMobileSplitView, isNarrow]);

  React.useLayoutEffect(() => {
    if (drawerOpen) {
      wasDrawerOpenRef.current = true;
      drawerCloseButtonRef.current?.focus();
    } else if (wasDrawerOpenRef.current) {
      wasDrawerOpenRef.current = false;
      restoreDrawerFocus();
    }
  }, [drawerOpen, restoreDrawerFocus]);

  const ScrollToBottomComponent = (slots?.scrollToBottom ??
    ChatScrollToBottomAffordance) as typeof ChatScrollToBottomAffordance;
  const ConversationListComponent = (slots?.conversationList ??
    ChatConversationList) as typeof ChatConversationList;
  const MessageListComponent = (slots?.messageList ?? ChatMessageList) as typeof ChatMessageList;
  const SuggestionsComponent = (slots?.suggestions ?? ChatSuggestions) as typeof ChatSuggestions;

  // Use refs so renderItem is stable and doesn't cause the virtualized list
  // to re-render every time a new object reference is passed for slots/slotProps.
  const slotsRef = React.useRef(slots);
  const slotPropsRef = React.useRef(slotProps);
  const featuresRef = React.useRef(features);
  slotsRef.current = slots;
  slotPropsRef.current = slotProps;
  featuresRef.current = features;

  const renderItem = React.useCallback(
    ({ id }: { id: string; index: number }) => (
      <DefaultMessageItem
        key={id}
        id={id}
        slots={slotsRef.current}
        slotProps={slotPropsRef.current}
        features={featuresRef.current}
      />
    ),
    [],
  );

  const drawerConversationListSlotProps = React.useMemo(
    () =>
      createConversationListSlotProps(slotProps?.conversationList?.slotProps, {
        onItemClick: handleDrawerClose,
      }),
    [handleDrawerClose, slotProps?.conversationList?.slotProps],
  );

  const splitConversationListSlotProps = React.useMemo(
    () =>
      createConversationListSlotProps(slotProps?.conversationList?.slotProps, {
        fullWidth: true,
      }),
    [slotProps?.conversationList?.slotProps],
  );

  const showSplitConversationList =
    hasConversationList && isMobileSplitView && !activeConversationId;
  const showThreadView =
    !hasConversationList || !isMobileSplitView || Boolean(activeConversationId);
  const showDrawerMenuButton = hasConversationList && isNarrow && !isMobileSplitView;
  const showBackButton = hasConversationList && isMobileSplitView && Boolean(activeConversationId);
  let conversationsPaneStyle: React.CSSProperties;

  if (isMobileSplitView) {
    conversationsPaneStyle = {
      width: '100%',
      flex: '1 1 100%',
      minWidth: 0,
      overflow: 'hidden',
    };
  } else if (isNarrow) {
    conversationsPaneStyle = {
      width: 0,
      flex: '0 0 0px',
      overflow: 'visible',
    };
  } else {
    conversationsPaneStyle = {
      width: 'var(--ChatBox-conversationListWidth, 260px)',
      flex: '0 0 var(--ChatBox-conversationListWidth, 260px)',
      minWidth: 0,
      overflow: 'hidden',
    };
  }

  return (
    <ChatLayout
      className={layoutClassName}
      style={{ flex: 1, minHeight: 0 }}
      slotProps={{
        conversationsPane: {
          ...(conversationsPaneClassName ? { className: conversationsPaneClassName } : {}),
          style: conversationsPaneStyle,
        },
        threadPane: {
          ...(threadPaneClassName ? { className: threadPaneClassName } : {}),
          style: {
            flex: 1,
            width: isNarrow ? '100%' : undefined,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        },
      }}
    >
      {hasConversationList && !isNarrow && (
        <ConversationListComponent variant={variant} {...(slotProps?.conversationList ?? {})} />
      )}

      {hasConversationList && isNarrow && !isMobileSplitView && drawerOpen && (
        <ChatBoxConversationOverlay>
          <ChatBoxConversationOverlayBackdrop
            type="button"
            aria-label={localeText.conversationHeaderCloseLabel}
            onClick={handleDrawerClose}
          />
          <MUIFocusTrap open={drawerOpen} disableRestoreFocus>
            <ChatBoxConversationOverlayPanel
              aria-label={localeText.conversationHeaderMenuLabel}
              aria-modal="true"
              role="dialog"
              onKeyDown={handleDrawerKeyDown}
              tabIndex={-1}
              style={{
                width: isFullWidthDrawer
                  ? '100%'
                  : 'min(var(--ChatBox-conversationListWidth, 260px), 100%)',
              }}
            >
              <ChatBoxDrawerContent>
                <ChatBoxDrawerHeader>
                  <Tooltip title={localeText.conversationHeaderCloseLabel}>
                    <IconButton
                      size="small"
                      aria-label={localeText.conversationHeaderCloseLabel}
                      onClick={handleDrawerClose}
                      ref={drawerCloseButtonRef}
                    >
                      <DefaultCloseIcon />
                    </IconButton>
                  </Tooltip>
                </ChatBoxDrawerHeader>
                <ConversationListComponent
                  variant={variant}
                  {...(slotProps?.conversationList ?? {})}
                  slotProps={drawerConversationListSlotProps}
                />
              </ChatBoxDrawerContent>
            </ChatBoxConversationOverlayPanel>
          </MUIFocusTrap>
        </ChatBoxConversationOverlay>
      )}

      {showSplitConversationList && (
        <ConversationListComponent
          variant={variant}
          {...(slotProps?.conversationList ?? {})}
          slotProps={splitConversationListSlotProps}
        />
      )}

      {showThreadView && (
        <ChatConversation>
          <DefaultConversationHeader
            slots={slots}
            slotProps={slotProps}
            features={features}
            onBackClick={handleBackClick}
            showBackButton={showBackButton}
            onMenuClick={handleMenuClick}
            showMenuButton={showDrawerMenuButton}
          />
          <MessageListComponent
            renderItem={renderItem}
            items={messageIds}
            autoScroll={autoScrollProp}
            overlay={
              <React.Fragment>
                {messageIds.length === 0 && !showSuggestions && (
                  <ChatBoxEmptyState>
                    <ChatBoxEmptyStateIcon
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </ChatBoxEmptyStateIcon>
                    <ChatBoxEmptyStateTitle>
                      {localeText.threadNoMessagesLabel}
                    </ChatBoxEmptyStateTitle>
                    <ChatBoxEmptyStateHelper>
                      {localeText.threadNoMessagesHelperText}
                    </ChatBoxEmptyStateHelper>
                  </ChatBoxEmptyState>
                )}
                {showSuggestions && messageIds.length === 0 && (
                  <SuggestionsComponent
                    suggestions={suggestions}
                    autoSubmit={suggestionsAutoSubmit}
                    {...(slotProps?.suggestions ?? {})}
                  />
                )}
                {showScrollToBottom && (
                  <ScrollToBottomComponent {...(slotProps?.scrollToBottom ?? {})} />
                )}
              </React.Fragment>
            }
            {...(slotProps?.messageList ?? {})}
          />
          <DefaultComposer slots={slots} slotProps={slotProps} features={features} />
        </ChatConversation>
      )}
    </ChatLayout>
  );
}
