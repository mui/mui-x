'use client';
import * as React from 'react';
import { useChat, useMessageIds, useConversations } from '@mui/x-chat-headless';
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
import { DefaultMessageItem } from '../ChatMessageList/DefaultMessageItem';
import { ChatScrollToBottomAffordance } from '../ChatIndicators/ChatScrollToBottomAffordance';
import { ChatSuggestions, type ChatSuggestionsProps } from '../ChatSuggestions/ChatSuggestions';
import type {
  ChatBoxFeatures,
  ChatBoxLayoutMode,
  ChatBoxLayoutModeBreakpoints,
} from './ChatBox.types';
import { useChatSlots } from '../internals/ChatSlotsContext';
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

const ChatBoxMessageListWrapper = styled('div', {
  name: 'MuiChatBox',
  slot: 'MessageListWrapper',
})({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

const ChatBoxCustomEmptyStateOverlay = styled('div', {
  name: 'MuiChatBox',
  slot: 'EmptyStateOverlay',
})({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
});

const ChatBoxCustomEmptyStateInner = styled('div', {
  name: 'MuiChatBox',
  slot: 'EmptyStateOverlayInner',
})({
  pointerEvents: 'auto',
});

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
})(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  zIndex: theme.zIndex.modal,
  pointerEvents: 'none',
}));

const ChatBoxConversationOverlayBackdrop = styled('div', {
  name: 'MuiChatBox',
  slot: 'ConversationOverlayBackdrop',
})(({ theme }) => ({
  position: 'absolute',
  inset: 0,
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

// A minimal bar that carries only the back/menu navigation affordances when the
// full conversation header chrome is disabled (`features.conversationHeader:
// false`). In split/overlay layouts these buttons are the only built-in way back
// to the conversation list, so they must survive even without the header.
const ChatBoxHeaderNavBar = styled('div', {
  name: 'MuiChatBox',
  slot: 'HeaderNavBar',
})({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
});

const DefaultBackIcon = React.memo(function DefaultBackIcon() {
  return (
    <svg
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

function DefaultConversationHeader({
  features,
  onBackClick,
  showBackButton,
  onMenuClick,
  showMenuButton,
}: {
  features?: ChatBoxFeatures;
  onBackClick?: () => void;
  showBackButton?: boolean;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}) {
  const { slots, slotProps } = useChatSlots();
  const localeText = useChatLocaleText();

  const navButtons = (
    <React.Fragment>
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
    </React.Fragment>
  );

  if (features?.conversationHeader === false) {
    // The header chrome is disabled, but the back/menu navigation must remain or
    // narrow-screen users get trapped in the thread with no way back to the list.
    if (!showBackButton && !showMenuButton) {
      return null;
    }
    return <ChatBoxHeaderNavBar>{navButtons}</ChatBoxHeaderNavBar>;
  }
  const ConversationHeaderComponent = (slots.conversationHeader ??
    ChatConversationHeader) as typeof ChatConversationHeader;
  const ConversationHeaderInfoComponent = (slots.conversationHeaderInfo ??
    ChatConversationHeaderInfo) as typeof ChatConversationHeaderInfo;
  const ConversationTitleComponent = (slots.conversationTitle ??
    ChatConversationTitle) as typeof ChatConversationTitle;
  const ConversationSubtitleComponent = (slots.conversationSubtitle ??
    ChatConversationSubtitle) as typeof ChatConversationSubtitle;
  const ConversationHeaderActionsComponent = (slots.conversationHeaderActions ??
    ChatConversationHeaderActions) as typeof ChatConversationHeaderActions;

  return (
    <ConversationHeaderComponent {...(slotProps.conversationHeader ?? {})}>
      {navButtons}
      <ConversationHeaderInfoComponent {...(slotProps.conversationHeaderInfo ?? {})}>
        <ConversationTitleComponent {...(slotProps.conversationTitle ?? {})} />
        <ConversationSubtitleComponent {...(slotProps.conversationSubtitle ?? {})} />
      </ConversationHeaderInfoComponent>
      <ConversationHeaderActionsComponent {...(slotProps.conversationHeaderActions ?? {})} />
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

function mergeLayoutSlotProps(
  slotProp: any,
  internalProps: { className?: string; style?: React.CSSProperties },
) {
  return (ownerState: any) => {
    const externalProps = typeof slotProp === 'function' ? slotProp(ownerState) : (slotProp ?? {});
    const className = [internalProps.className, externalProps?.className].filter(Boolean).join(' ');

    return {
      ...externalProps,
      ...(className ? { className } : {}),
      style: {
        ...(internalProps.style ?? {}),
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

function DefaultComposer({ features }: { features?: ChatBoxFeatures }) {
  const { slots, slotProps } = useChatSlots();
  const contextVariant = useChatVariant();
  const variant = slotProps.composerRoot?.variant ?? contextVariant;
  const showAttachments = features?.attachments !== false;
  const showHelperText = features?.helperText !== false;
  const attachmentConfig =
    typeof features?.attachments === 'object' ? features.attachments : undefined;
  // `slots.composerRoot` is wrapper-only: it swaps the styled root element of
  // `<ChatComposer>` while the default attach/input/send/toolbar render inside
  // via children. To go further (whole-composer replacement) consumers compose
  // their own form using the public composer hooks.
  const composerRootSlotOverride = slots.composerRoot;
  const ComposerInputComponent = (slots.composerInput ??
    ChatComposerTextArea) as typeof ChatComposerTextArea;
  const ComposerToolbarComponent = (slots.composerToolbar ??
    ChatComposerToolbar) as typeof ChatComposerToolbar;
  // Presentational slots: `null` hides the piece and the surrounding layout
  // collapses. `undefined` falls back to the default component.
  const showSendButton = slots.composerSendButton !== null;
  const ComposerSendButtonComponent = (slots.composerSendButton ??
    ChatComposerSendButton) as typeof ChatComposerSendButton;
  const showAttachButton = showAttachments && slots.composerAttachButton !== null;
  const ComposerAttachButtonComponent = (slots.composerAttachButton ??
    ChatComposerAttachButton) as typeof ChatComposerAttachButton;
  const ComposerAttachmentListComponent = (slots.composerAttachmentList ??
    ChatComposerAttachmentList) as typeof ChatComposerAttachmentList;
  const ComposerHelperTextComponent = (slots.composerHelperText ??
    ChatComposerHelperText) as typeof ChatComposerHelperText;
  const localeText = useChatLocaleText();

  // Forward `slots.composerRoot` as ChatComposer's own root slot override.
  const composerRootProps = {
    attachmentConfig,
    ...(slotProps.composerRoot ?? {}),
    slots: { root: composerRootSlotOverride, ...((slotProps.composerRoot as any)?.slots ?? {}) },
  } as any;

  if (variant === 'compact') {
    return (
      <ChatComposer variant="compact" {...composerRootProps}>
        {showAttachments && (
          <ComposerAttachmentListComponent {...(slotProps.composerAttachmentList ?? {})} />
        )}
        {showAttachButton && (
          <ComposerAttachButtonComponent
            aria-label={localeText.composerAttachButtonLabel}
            {...(slotProps.composerAttachButton ?? {})}
          >
            <DefaultAttachIcon />
          </ComposerAttachButtonComponent>
        )}
        <ComposerInputComponent
          maxRows={5}
          placeholder={localeText.composerInputPlaceholder}
          {...(slotProps.composerInput ?? {})}
        />
        {/*
          Honor the `toolbar` slot in compact too: wrapping the trailing send
          button gives consumers a single override point to inject extra
          actions (mic, model picker, slash menu, etc.) without hijacking the
          attach slot. The default toolbar in compact composes via the
          ChatComposer's row-flex so the visual layout is unchanged.
        */}
        {showSendButton && (
          <ComposerToolbarComponent {...(slotProps.composerToolbar ?? {})}>
            <ComposerSendButtonComponent
              aria-label={localeText.composerSendButtonLabel}
              {...(slotProps.composerSendButton ?? {})}
            >
              <DefaultSendIcon />
            </ComposerSendButtonComponent>
          </ComposerToolbarComponent>
        )}
      </ChatComposer>
    );
  }

  return (
    <ChatComposer {...composerRootProps}>
      {showAttachments && (
        <ComposerAttachmentListComponent {...(slotProps.composerAttachmentList ?? {})} />
      )}
      <ComposerInputComponent
        placeholder={localeText.composerInputPlaceholder}
        {...(slotProps.composerInput ?? {})}
      />
      {showHelperText && <ComposerHelperTextComponent {...(slotProps.composerHelperText ?? {})} />}
      <ComposerToolbarComponent {...(slotProps.composerToolbar ?? {})}>
        {showAttachButton && (
          <ComposerAttachButtonComponent
            aria-label={localeText.composerAttachButtonLabel}
            {...(slotProps.composerAttachButton ?? {})}
          >
            <DefaultAttachIcon />
          </ComposerAttachButtonComponent>
        )}
        {showSendButton && (
          <ComposerSendButtonComponent
            aria-label={localeText.composerSendButtonLabel}
            {...(slotProps.composerSendButton ?? {})}
          >
            <DefaultSendIcon />
          </ComposerSendButtonComponent>
        )}
      </ComposerToolbarComponent>
    </ChatComposer>
  );
}

function AboveComposerSuggestions(props: {
  SuggestionsComponent: typeof ChatSuggestions;
  suggestions: Array<ChatSuggestion | string> | undefined;
  autoSubmit: boolean | undefined;
  consumerSlotProps: Partial<ChatSuggestionsProps> | undefined;
}) {
  const { SuggestionsComponent, suggestions, autoSubmit, consumerSlotProps } = props;
  const consumerSuggestionsSlotProps = (consumerSlotProps?.slotProps as any) ?? {};
  const consumerRootSlotProp = consumerSuggestionsSlotProps.root ?? {};
  // Two visual modes keyed off the `data-empty` attribute that SuggestionsRoot
  // sets when the thread has zero messages:
  // - empty (data-empty present): vertical column of pills, centered. Reads as a
  //   hero CTA alongside the custom empty-state slot.
  // - active (data-empty absent): horizontal "next-prompt" row above the composer
  //   with overflow-x scrolling for long suggestion sets.
  const aboveComposerDefaultsSx = {
    '&[data-empty]': {
      flexDirection: 'column',
      alignItems: 'center',
      flexWrap: 'nowrap',
      overflowX: 'visible',
      gap: (theme: any) => theme.spacing(1),
      padding: (theme: any) => theme.spacing(2),
    },
    '&:not([data-empty])': {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      // `justify-content: center` from ChatSuggestionsRootStyled pushes the
      // items into negative space when they overflow — the browser only lets
      // you scroll into the right overflow, so the leftmost pill becomes
      // unreachable. Pack items from the start so overflow is one-sided.
      justifyContent: 'flex-start',
      overflowX: 'auto',
      gap: (theme: any) => theme.spacing(1),
      paddingInline: (theme: any) => theme.spacing(1.5),
      paddingBlock: (theme: any) => theme.spacing(1),
      scrollbarWidth: 'thin',
      // Keep pills from squishing once the row overflows.
      '& .MuiChatSuggestions-item': { flex: '0 0 auto' },
    },
  };
  // Prepend the above-composer defaults to whatever `sx` the consumer supplied,
  // keeping their override last so it wins.
  const mergeRootSx = (consumerSx: unknown): unknown => {
    if (Array.isArray(consumerSx)) {
      return [aboveComposerDefaultsSx, ...consumerSx];
    }
    if (consumerSx) {
      return [aboveComposerDefaultsSx, consumerSx];
    }
    return aboveComposerDefaultsSx;
  };
  // `root` slotProps support both the object form and the `(ownerState) => props`
  // callback form. Preserve the callback instead of spreading it into an empty
  // object (which would silently drop the consumer's owner-state-driven props).
  const rootSlotProp =
    typeof consumerRootSlotProp === 'function'
      ? (ownerState: any) => {
          const resolved = consumerRootSlotProp(ownerState) ?? {};
          return { ...resolved, sx: mergeRootSx(resolved.sx) };
        }
      : { ...consumerRootSlotProp, sx: mergeRootSx(consumerRootSlotProp.sx) };
  return (
    <SuggestionsComponent
      suggestions={suggestions}
      autoSubmit={autoSubmit}
      alwaysVisible
      {...(consumerSlotProps ?? {})}
      slotProps={
        {
          ...consumerSuggestionsSlotProps,
          root: rootSlotProp,
        } as any
      }
    />
  );
}

export function ChatBoxContent(props: ChatBoxContentProps) {
  const {
    variant,
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
  const { slots, slotProps } = useChatSlots();
  const showScrollToBottom = features?.scrollToBottom !== false;
  const showSuggestions =
    features?.suggestions !== false && !!suggestions && suggestions.length > 0;
  const CustomEmptyStateComponent = slots.emptyState;
  // `slotProps.emptyState` is typed as `SlotComponentProps`, so it can be the
  // `(ownerState) => props` callback form. Resolve it (ownerState is empty) rather
  // than spreading the function as an object, which would drop its className/sx/handlers.
  const customEmptyStateProps =
    typeof slotProps.emptyState === 'function'
      ? (slotProps.emptyState as (ownerState: {}) => object)({})
      : (slotProps.emptyState ?? {});

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
  const hasConversationList = features?.conversationList === true && conversations.length > 0;

  const isEmptyThread = messageIds.length === 0;
  const showCustomEmptyState = isEmptyThread && Boolean(CustomEmptyStateComponent);
  const showDefaultEmptyState = isEmptyThread && !CustomEmptyStateComponent && !showSuggestions;
  const showCenterSuggestions = isEmptyThread && !CustomEmptyStateComponent && showSuggestions;
  const showAboveComposerSuggestions = showSuggestions && !showCenterSuggestions;

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

  const ScrollToBottomComponent = (slots.scrollToBottom ??
    ChatScrollToBottomAffordance) as typeof ChatScrollToBottomAffordance;
  const ConversationListComponent = (slots.conversationList ??
    ChatConversationList) as typeof ChatConversationList;
  const MessageListComponent = (slots.messageList ?? ChatMessageList) as typeof ChatMessageList;
  const SuggestionsComponent = (slots.suggestions ?? ChatSuggestions) as typeof ChatSuggestions;

  // The rendered id list — `slotProps.messageList.items` lets a consumer narrow
  // the thread; otherwise the full conversation order is used. `useMessageIds()`
  // returns a stable reference, so forwarding it does not churn row memoization.
  const renderedItemIds = (slotProps.messageList?.items ?? messageIds) as string[];

  // The per-row slots/slotProps are read from the `ChatSlots` context inside
  // `DefaultMessageItem`, so `renderItem` carries no slot payload and stays
  // stable across scroll-driven re-renders of the virtualized list. The rendered
  // `index` and `items` ARE forwarded so the group computes grouping (prev/next
  // neighbor lookup) against the rendered list rather than falling back to the
  // full conversation — important when `slotProps.messageList.items` is a subset.
  const renderItem = React.useCallback(
    ({ id, index }: { id: string; index: number }) => (
      <DefaultMessageItem key={id} id={id} index={index} items={renderedItemIds} />
    ),
    [renderedItemIds],
  );

  const drawerConversationListSlotProps = React.useMemo(
    () =>
      createConversationListSlotProps(slotProps.conversationList?.slotProps, {
        onItemClick: handleDrawerClose,
      }),
    [handleDrawerClose, slotProps.conversationList?.slotProps],
  );

  const splitConversationListSlotProps = React.useMemo(
    () =>
      createConversationListSlotProps(slotProps.conversationList?.slotProps, {
        fullWidth: true,
      }),
    [slotProps.conversationList?.slotProps],
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
      slots={{
        root: slots.layout,
        conversationsPane: slots.conversationsPane,
        threadPane: slots.threadPane,
      }}
      slotProps={{
        root: mergeLayoutSlotProps(slotProps.layout, {
          className: layoutClassName,
          style: { flex: 1, minHeight: 0 },
        }),
        conversationsPane: mergeLayoutSlotProps(slotProps.conversationsPane, {
          className: conversationsPaneClassName,
          style: conversationsPaneStyle,
        }),
        threadPane: mergeLayoutSlotProps(slotProps.threadPane, {
          className: threadPaneClassName,
          style: {
            flex: 1,
            width: isNarrow ? '100%' : undefined,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }),
      }}
    >
      {hasConversationList && !isNarrow && (
        <ConversationListComponent variant={variant} {...(slotProps.conversationList ?? {})} />
      )}

      {hasConversationList && isNarrow && !isMobileSplitView && drawerOpen && (
        <ChatBoxConversationOverlay>
          <ChatBoxConversationOverlayBackdrop aria-hidden="true" onClick={handleDrawerClose} />
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
                  {...(slotProps.conversationList ?? {})}
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
          {...(slotProps.conversationList ?? {})}
          slotProps={splitConversationListSlotProps}
        />
      )}

      {showThreadView && (
        <ChatConversation
          {...(slotProps.conversationRoot ?? {})}
          slots={{
            root: slots.conversationRoot,
            ...((slotProps.conversationRoot as any)?.slots ?? {}),
          }}
        >
          <DefaultConversationHeader
            features={features}
            onBackClick={handleBackClick}
            showBackButton={showBackButton}
            onMenuClick={handleMenuClick}
            showMenuButton={showDrawerMenuButton}
          />
          <ChatBoxMessageListWrapper>
            <MessageListComponent
              renderItem={renderItem}
              items={messageIds}
              autoScroll={autoScrollProp}
              overlay={
                <React.Fragment>
                  {showDefaultEmptyState && (
                    <ChatBoxEmptyState>
                      <ChatBoxEmptyStateIcon
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
                  {showCenterSuggestions && (
                    <SuggestionsComponent
                      suggestions={suggestions}
                      autoSubmit={suggestionsAutoSubmit}
                      {...(slotProps.suggestions ?? {})}
                    />
                  )}
                  {showScrollToBottom && (
                    <ScrollToBottomComponent {...(slotProps.scrollToBottom ?? {})} />
                  )}
                </React.Fragment>
              }
              {...(slotProps.messageList ?? {})}
            />
            {showCustomEmptyState && CustomEmptyStateComponent && (
              <ChatBoxCustomEmptyStateOverlay>
                <ChatBoxCustomEmptyStateInner>
                  <CustomEmptyStateComponent {...customEmptyStateProps} />
                </ChatBoxCustomEmptyStateInner>
              </ChatBoxCustomEmptyStateOverlay>
            )}
          </ChatBoxMessageListWrapper>
          {showAboveComposerSuggestions && (
            <AboveComposerSuggestions
              SuggestionsComponent={SuggestionsComponent}
              suggestions={suggestions}
              autoSubmit={suggestionsAutoSubmit}
              consumerSlotProps={slotProps.suggestions}
            />
          )}
          <DefaultComposer features={features} />
        </ChatConversation>
      )}
    </ChatLayout>
  );
}
