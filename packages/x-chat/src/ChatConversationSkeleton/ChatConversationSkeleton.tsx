'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import type { SxProps, Theme } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system/createStyled';
import { styled } from '../internals/material/chatStyled';

export interface ChatConversationSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  dense?: boolean;
  sx?: SxProps<Theme>;
}

const ChatConversationSkeletonRoot = styled('div', {
  name: 'MuiChatConversationSkeleton',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'ownerState',
})<{ ownerState: { dense: boolean } }>(({ theme, ownerState }) => ({
  alignItems: 'center',
  columnGap: theme.spacing(ownerState.dense ? 1 : 1.5),
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  gridTemplateRows: 'auto auto',
  minWidth: 0,
  padding: theme.spacing(ownerState.dense ? 1 : 1.25, ownerState.dense ? 1.25 : 1.5),
  rowGap: theme.spacing(0.5),
}));

const ChatConversationSkeletonAvatar = styled(Avatar, {
  name: 'MuiChatConversationSkeleton',
  slot: 'Avatar',
  overridesResolver: (_, styles) => styles.avatar,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'ownerState',
})<{ ownerState: { dense: boolean } }>(({ ownerState }) => ({
  gridColumn: 1,
  gridRow: '1 / span 2',
  height: ownerState.dense ? 32 : 40,
  width: ownerState.dense ? 32 : 40,
}));

const ChatConversationSkeleton = React.forwardRef(function ChatConversationSkeleton(
  props: ChatConversationSkeletonProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, dense = false, style, sx, ...other } = props;
  const ownerState = { dense };

  return (
    <ChatConversationSkeletonRoot
      className={className}
      ownerState={ownerState}
      ref={ref}
      style={style}
      sx={sx}
      {...other}
    >
      <ChatConversationSkeletonAvatar ownerState={ownerState} variant="rounded">
        <Skeleton height="100%" variant="rounded" width="100%" />
      </ChatConversationSkeletonAvatar>
      <Skeleton height={18} sx={{ gridColumn: 2, gridRow: 1 }} width="58%" />
      <Skeleton height={16} sx={{ gridColumn: 2, gridRow: 2 }} width="78%" />
      <Skeleton height={14} sx={{ gridColumn: 3, gridRow: 1 }} width={36} />
      <Skeleton height={20} sx={{ borderRadius: 999, gridColumn: 3, gridRow: 2 }} width={28} />
    </ChatConversationSkeletonRoot>
  );
});

ChatConversationSkeleton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  dense: PropTypes.bool,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatConversationSkeleton };
