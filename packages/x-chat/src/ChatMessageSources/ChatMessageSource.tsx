'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatMessageSourceUtilityClasses,
  type ChatMessageSourceClasses,
} from './chatMessageSourceClasses';

const useThemeProps = createUseThemeProps('MuiChatMessageSource');

const ChatMessageSourceRootStyled = styled('li', {
  name: 'MuiChatMessageSource',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(() => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: 6,
  minWidth: 0,
}));

const ChatMessageSourceIndexStyled = styled('span', {
  name: 'MuiChatMessageSource',
  slot: 'Index',
  overridesResolver: (_, styles) => styles.index,
})(({ theme }) => ({
  fontSize: '0.65rem',
  color: (theme.vars || theme).palette.text.disabled,
  minWidth: 16,
  textAlign: 'center',
  flexShrink: 0,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1.5,
}));

const ChatMessageSourceLinkStyled = styled('a', {
  name: 'MuiChatMessageSource',
  slot: 'Link',
  overridesResolver: (_, styles) => styles.link,
})(({ theme }) => ({
  color: (theme.vars || theme).palette.primary.main,
  fontSize: theme.typography.caption.fontSize,
  textDecoration: 'none',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export interface ChatMessageSourceSlots {
  /** The root list item element. @default 'li' */
  root?: React.ElementType;
  /** The numeric index badge. @default 'span' */
  index?: React.ElementType;
  /** The anchor link. @default 'a' */
  link?: React.ElementType;
}

export interface ChatMessageSourceSlotProps {
  root?: SlotComponentPropsFromProps<'li', {}, {}>;
  index?: SlotComponentPropsFromProps<'span', {}, {}>;
  link?: SlotComponentPropsFromProps<'a', {}, {}>;
}

export interface ChatMessageSourceProps {
  /** The URL this source links to. */
  href: string;
  /** Display title for the source. Falls back to `href` when omitted. */
  title?: string;
  /** 1-based position number displayed as a muted badge. */
  index?: number;
  children?: React.ReactNode;
  className?: string;
  classes?: Partial<ChatMessageSourceClasses>;
  slots?: ChatMessageSourceSlots;
  slotProps?: ChatMessageSourceSlotProps;
}

type ChatMessageSourceComponent = ((
  props: ChatMessageSourceProps & React.RefAttributes<HTMLLIElement>,
) => React.JSX.Element | null) & { propTypes?: any };

const ChatMessageSource = React.forwardRef(function ChatMessageSource(
  inProps: ChatMessageSourceProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatMessageSource' });
  const {
    href,
    title,
    index: indexProp,
    children,
    className,
    classes: classesProp,
    slots,
    slotProps,
    ...other
  } = props;
  const classes = useChatMessageSourceUtilityClasses(classesProp);

  const Root = slots?.root ?? ChatMessageSourceRootStyled;
  const Index = slots?.index ?? ChatMessageSourceIndexStyled;
  const LinkSlot = slots?.link ?? ChatMessageSourceLinkStyled;

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

  const indexProps = useSlotProps({
    elementType: Index,
    externalSlotProps: slotProps?.index,
    ownerState: {},
    additionalProps: {
      className: classes.index,
    },
  });

  const linkProps = useSlotProps({
    elementType: LinkSlot,
    externalSlotProps: slotProps?.link,
    ownerState: {},
    additionalProps: {
      href,
      target: '_blank',
      rel: 'noreferrer noopener',
      className: classes.link,
    },
  });

  return (
    <Root {...rootProps}>
      {indexProp != null && <Index {...indexProps}>[{indexProp}]</Index>}
      <LinkSlot {...linkProps}>{children ?? title ?? href}</LinkSlot>
    </Root>
  );
}) as ChatMessageSourceComponent;

ChatMessageSource.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * The URL this source links to.
   */
  href: PropTypes.string.isRequired,
  /**
   * 1-based position number displayed as a muted badge.
   */
  index: PropTypes.number,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  /**
   * Display title for the source. Falls back to `href` when omitted.
   */
  title: PropTypes.string,
} as any;

export { ChatMessageSource };
