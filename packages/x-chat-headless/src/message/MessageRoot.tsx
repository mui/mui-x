'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import useForkRef from '@mui/utils/useForkRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { SlotComponentProps } from '@mui/utils/types';
import { useMessage } from '../hooks/useMessage';
import { useMessageAuthor } from '../hooks/useMessageAuthor';
import { useChatVariant } from '../chat/internals/ChatVariantContext';
import { useChatDensity } from '../chat/internals/ChatDensityContext';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { getDataAttributes } from '../internals/getDataAttributes';
import { mergeReactProps } from '../internals/mergeReactProps';
import {
  focusFirstFocusableDescendant,
  useMessageRovingContext,
  useMessageRovingItem,
} from '../message-list/internals/MessageRovingContext';
import { MessageContextProvider } from './internals/MessageContext';
import { type MessageRootOwnerState } from './message.types';

export interface MessageRootSlots {
  root: React.ElementType;
}

export interface MessageRootSlotProps {
  root?: SlotComponentProps<'div', {}, MessageRootOwnerState>;
}

export interface MessageRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  messageId: string;
  isGrouped?: boolean;
  slots?: Partial<MessageRootSlots>;
  slotProps?: MessageRootSlotProps;
  /**
   * @ignore
   * Internal: the compact group author label injected by the headless
   * `MessageGroup` for the Material `ChatMessage` to place in its CSS grid.
   * `MessageRoot` renders the consumer's own composition and owns its layout,
   * so it deliberately drops this prop instead of forwarding it to the DOM.
   */
  groupAuthorName?: React.ReactNode;
}

type MessageRootComponent = ((
  props: MessageRootProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const MessageRoot = React.forwardRef(function MessageRoot(
  props: MessageRootProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    messageId,
    isGrouped = false,
    slots,
    slotProps,
    children,
    groupAuthorName,
    ...other
  } = props;
  // Dropped on purpose: `groupAuthorName` is a private MessageGroup→ChatMessage
  // channel. A headless `MessageRoot` composition owns its own layout, so we must
  // not forward this non-DOM prop to the root element (it would otherwise leak as
  // an unknown DOM attribute). Pulling it out of `...other` is the whole point.
  void groupAuthorName;
  const message = useMessage(messageId);
  const resolvedAuthor = useMessageAuthor(messageId);
  const variant = useChatVariant();
  const density = useChatDensity();
  const localeText = useChatLocaleText();
  const ownerState = React.useMemo<MessageRootOwnerState>(
    () => ({
      messageId,
      message,
      role: message?.role,
      status: message?.status,
      streaming: message?.status === 'streaming',
      error: message?.status === 'error',
      isGrouped,
      variant,
      density,
      resolvedAuthor,
      showAvatar: resolvedAuthor?.avatarUrl != null,
      isOwnMessage: resolvedAuthor?.isOwnMessage ?? message?.role === 'user',
    }),
    [density, isGrouped, message, messageId, resolvedAuthor, variant],
  );
  // Roving focus: inside a `MessageListRoot` with roving enabled, the article
  // is the list's roving tabindex item (the whole list is a single Tab stop).
  // Outside a roving list the context is null and the article stays a plain,
  // non-focusable container.
  const roving = useMessageRovingContext();
  const rovingItem = useMessageRovingItem(messageId);
  const localRootRef = React.useRef<HTMLElement | null>(null);
  const registerRovingRef = React.useCallback(
    (element: HTMLElement | null) => {
      localRootRef.current = element;
      roving?.registerItemRef(messageId, element);
    },
    [messageId, roving],
  );
  const handleRef = useForkRef(ref, registerRovingRef);

  // Entering drill-in (Enter on the focused article) moves focus to the first
  // focusable descendant once the actionable re-render has restored the
  // interior controls' tab order. Skipped when focus is already inside (e.g.
  // the user clicked a control directly).
  useEnhancedEffect(() => {
    if (!rovingItem.actionable) {
      return;
    }

    const article = localRootRef.current;
    if (article == null) {
      return;
    }

    if (article.contains(document.activeElement) && document.activeElement !== article) {
      return;
    }

    focusFirstFocusableDescendant(article);
  }, [rovingItem.actionable]);

  const Root = slots?.root ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref: handleRef,
      // `article` is the correct landmark for a self-contained unit of content
      // (each chat message is a discrete piece of content in a feed).
      // Screen readers announce "article" when entering, which helps users
      // understand the structural boundary between messages.
      role: 'article',
      'aria-label': resolvedAuthor?.displayName
        ? `Message from ${resolvedAuthor.displayName}`
        : localeText.messageLabel,
      // Hint assistive tech to defer announcing the streaming message until
      // it completes (best effort; the message list's status announcer
      // carries the explicit streaming announcements).
      'aria-busy': ownerState.streaming || undefined,
      ...(rovingItem.enabled && {
        tabIndex: rovingItem.focused ? 0 : -1,
        'data-actionable': rovingItem.actionable ? 'true' : undefined,
      }),
      ...getDataAttributes({
        role: ownerState.role,
        status: ownerState.status,
        streaming: ownerState.streaming,
        error: ownerState.error,
        isGrouped: ownerState.isGrouped,
        isOwnMessage: ownerState.isOwnMessage,
      }),
    },
  });

  // The roving handlers are merged on top of the resolved slot props so
  // consumer-provided handlers (via `slotProps.root` or forwarded props) keep
  // running — `useSlotProps` alone would let one silently drop the other.
  const composedRootProps =
    roving == null
      ? rootProps
      : mergeReactProps(rootProps, {
          onFocus: () => {
            roving.onItemFocus(messageId);
          },
          onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
            roving.onItemKeyDown(event, messageId);
          },
          onBlur: (event: React.FocusEvent<HTMLElement>) => {
            roving.onItemBlur(event, messageId);
          },
        });

  return (
    <MessageContextProvider value={ownerState}>
      <Root {...composedRootProps}>{children}</Root>
    </MessageContextProvider>
  );
}) as MessageRootComponent;
