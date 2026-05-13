'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { keyframes } from '@mui/system';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatMessageSkeletonUtilityClasses,
  type ChatMessageSkeletonClasses,
} from './chatMessageSkeletonClasses';

const useThemeProps = createUseThemeProps('MuiChatMessageSkeleton');

const shimmerKeyframes = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const ChatMessageSkeletonRootStyled = styled('div', {
  name: 'MuiChatMessageSkeleton',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 0),
}));

const ChatMessageSkeletonLineStyled = styled('div', {
  name: 'MuiChatMessageSkeleton',
  slot: 'Line',
  overridesResolver: (_, styles) => styles.line,
})(({ theme }) => ({
  height: '0.875em',
  borderRadius: theme.shape.borderRadius,
  background: `linear-gradient(
    90deg,
    ${(theme.vars || theme).palette.action.hover} 25%,
    ${(theme.vars || theme).palette.action.selected} 37%,
    ${(theme.vars || theme).palette.action.hover} 63%
  )`,
  backgroundSize: '400% 100%',
  animation: `${shimmerKeyframes} 1.4s ease infinite`,
  '&:last-child': {
    width: '60%',
  },
}));

export interface ChatMessageSkeletonSlots {
  /** The root container element. @default 'div' */
  root?: React.ElementType;
  /** Each animated shimmer line element. @default 'div' */
  line?: React.ElementType;
}

export interface ChatMessageSkeletonSlotProps {
  root?: SlotComponentProps<'div', {}, {}>;
  line?: SlotComponentProps<'div', {}, {}>;
}

export interface ChatMessageSkeletonProps {
  /**
   * Number of shimmer lines to render.
   * @default 3
   */
  lines?: number;
  className?: string;
  classes?: Partial<ChatMessageSkeletonClasses>;
  slots?: ChatMessageSkeletonSlots;
  slotProps?: ChatMessageSkeletonSlotProps;
}

type ChatMessageSkeletonComponent = ((
  props: ChatMessageSkeletonProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

const ChatMessageSkeleton = React.forwardRef(function ChatMessageSkeleton(
  inProps: ChatMessageSkeletonProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatMessageSkeleton' });
  const { lines = 3, className, classes: classesProp, slots, slotProps, ...other } = props;
  const classes = useChatMessageSkeletonUtilityClasses(classesProp);

  const Root = slots?.root ?? ChatMessageSkeletonRootStyled;
  const Line = slots?.line ?? ChatMessageSkeletonLineStyled;

  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState: {},
    additionalProps: {
      ref,
      className: clsx(classes.root, className),
    },
  });

  const lineSlotProps = slotProps?.line as React.HTMLAttributes<HTMLDivElement> | undefined;

  return (
    <Root {...rootProps}>
      {Array.from({ length: lines }, (_, i) => (
        <Line key={i} {...lineSlotProps} className={clsx(classes.line, lineSlotProps?.className)} />
      ))}
    </Root>
  );
}) as ChatMessageSkeletonComponent;

ChatMessageSkeleton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Number of shimmer lines to render.
   * @default 3
   */
  lines: PropTypes.number,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
} as any;

export { ChatMessageSkeleton };
