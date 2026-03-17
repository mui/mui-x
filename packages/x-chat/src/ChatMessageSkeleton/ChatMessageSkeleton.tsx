'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import type { SxProps, Theme } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system/createStyled';
import { styled } from '../internals/material/chatStyled';

export interface ChatMessageSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'assistant' | 'user' | 'system';
  className?: string;
  lines?: number;
  sx?: SxProps<Theme>;
}

const ChatMessageSkeletonRoot = styled('div', {
  name: 'MuiChatMessageSkeleton',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'ownerState',
})<{
  ownerState: { align: NonNullable<ChatMessageSkeletonProps['align']> };
}>(({ theme, ownerState }) => {
  let justifyContent: string;
  if (ownerState.align === 'system') {
    justifyContent = 'center';
  } else if (ownerState.align === 'user') {
    justifyContent = 'flex-end';
  } else {
    justifyContent = 'flex-start';
  }

  return {
    alignItems: ownerState.align === 'system' ? 'center' : 'flex-end',
    display: 'flex',
    flexDirection: ownerState.align === 'user' ? 'row-reverse' : 'row',
    gap: theme.spacing(1),
    justifyContent,
    minWidth: 0,
  };
});

const ChatMessageSkeletonBubble = styled('div', {
  name: 'MuiChatMessageSkeleton',
  slot: 'Bubble',
  overridesResolver: (_, styles) => styles.bubble,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'ownerState',
})<{
  ownerState: { align: NonNullable<ChatMessageSkeletonProps['align']> };
}>(({ theme, ownerState }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  maxWidth: ownerState.align === 'system' ? '60%' : '72%',
  minWidth: ownerState.align === 'system' ? theme.spacing(18) : theme.spacing(22),
}));

const ChatMessageSkeleton = React.forwardRef(function ChatMessageSkeleton(
  props: ChatMessageSkeletonProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { align = 'assistant', className, lines = 2, style, sx, ...other } = props;
  const ownerState = { align };
  const widths = React.useMemo(() => {
    const base = ['78%', '62%', '54%'];
    return base.slice(0, Math.max(1, Math.min(lines, base.length)));
  }, [lines]);

  return (
    <ChatMessageSkeletonRoot
      className={className}
      ownerState={ownerState}
      ref={ref}
      style={style}
      sx={sx}
      {...other}
    >
      {align === 'system' ? null : (
        <Avatar sx={{ height: 32, visibility: align === 'user' ? 'hidden' : 'visible', width: 32 }}>
          <Skeleton height="100%" variant="circular" width="100%" />
        </Avatar>
      )}
      <ChatMessageSkeletonBubble ownerState={ownerState}>
        {widths.map((width, index) => (
          <Skeleton
            key={`${align}-${width}-${index}`}
            height={index === widths.length - 1 ? 14 : 18}
            sx={{ borderRadius: 3 }}
            variant="rounded"
            width={width}
          />
        ))}
      </ChatMessageSkeletonBubble>
    </ChatMessageSkeletonRoot>
  );
});

ChatMessageSkeleton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  align: PropTypes.oneOf(['assistant', 'system', 'user']),
  className: PropTypes.string,
  lines: PropTypes.number,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatMessageSkeleton };
