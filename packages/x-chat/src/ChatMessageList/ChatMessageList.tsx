'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import {
  MessageListRoot,
  type MessageListRootProps,
  type MessageListRootHandle,
  useChatDensity,
} from '@mui/x-chat-unstyled';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatMessageListUtilityClasses,
  type ChatMessageListClasses,
} from './chatMessageListClasses';

const useThemeProps = createUseThemeProps('MuiChatMessageList');

export interface ChatMessageListProps extends MessageListRootProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageListClasses>;
}

const ChatMessageListStyled = styled('div', {
  name: 'MuiChatMessageList',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
}));

const ChatMessageListScrollerStyled = styled('div', {
  name: 'MuiChatMessageList',
  slot: 'Scroller',
  overridesResolver: (_, styles) => styles.scroller,
})(() => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollbarWidth: 'thin',
  minHeight: 0,
}));

const ChatMessageListContentStyled = styled('div', {
  name: 'MuiChatMessageList',
  slot: 'Content',
  overridesResolver: (_, styles) => styles.content,
})<{ ownerState?: { density?: string } }>(({ theme, ownerState }) => {
  const densityPaddingBlock: Record<string, string> = {
    compact: theme.spacing(0.5),
    standard: theme.spacing(1),
    comfortable: theme.spacing(1.5),
  };
  return {
    display: 'flex',
    flexDirection: 'column',
    paddingBlock: densityPaddingBlock[ownerState?.density ?? 'standard'],
    boxSizing: 'border-box',
  };
});

const ChatMessageList = React.forwardRef<MessageListRootHandle, ChatMessageListProps>(
  function ChatMessageList(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessageList' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatMessageListUtilityClasses(classesProp);
    const density = useChatDensity();

    return (
      <MessageListRoot
        ref={ref}
        {...other}
        slots={{
          messageList: slots?.messageList ?? ChatMessageListStyled,
          messageListScroller: slots?.messageListScroller ?? ChatMessageListScrollerStyled,
          messageListContent: slots?.messageListContent ?? ChatMessageListContentStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          messageList: {
            className: clsx(classes.root, className),
            sx,
            ...slotProps?.messageList,
          } as any,
          messageListScroller: {
            className: classes.scroller,
            ...slotProps?.messageListScroller,
          } as any,
          messageListContent: {
            className: classes.content,
            ownerState: { density },
            ...slotProps?.messageListContent,
          } as any,
        }}
      />
    );
  },
);

ChatMessageList.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Controls automatic scrolling to the bottom when new messages arrive or
   * streaming content grows, as long as the user is within `buffer` pixels of
   * the bottom.
   *
   * - `true` – enable with the default buffer (150 px).
   * - `{ buffer: number }` – enable with a custom threshold.
   * - `false` – disable (the scroll-to-bottom affordance is still available).
   *
   * Scrolling when the *user* sends a message is always active.
   * @default true
   */
  autoScroll: PropTypes.oneOfType([
    PropTypes.shape({
      buffer: PropTypes.number,
    }),
    PropTypes.bool,
  ]),
  classes: PropTypes.object,
  className: PropTypes.string,
  estimatedItemSize: PropTypes.number,
  getItemKey: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.string),
  onReachTop: PropTypes.func,
  overlay: PropTypes.node,
  renderItem: PropTypes.func.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatMessageList };
