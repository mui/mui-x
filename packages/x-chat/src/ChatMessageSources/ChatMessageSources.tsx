'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatMessageSourcesUtilityClasses,
  type ChatMessageSourcesClasses,
} from './chatMessageSourcesClasses';

const useThemeProps = createUseThemeProps('MuiChatMessageSources');

const ChatMessageSourcesRootStyled = styled('div', {
  name: 'MuiChatMessageSources',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));

const ChatMessageSourcesLabelStyled = styled('p', {
  name: 'MuiChatMessageSources',
  slot: 'Label',
  overridesResolver: (_, styles) => styles.label,
})(({ theme }) => ({
  margin: 0,
  paddingBottom: theme.spacing(0.25),
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
  fontWeight: theme.typography.fontWeightMedium,
}));

const ChatMessageSourcesListStyled = styled('ol', {
  name: 'MuiChatMessageSources',
  slot: 'List',
  overridesResolver: (_, styles) => styles.list,
})(({ theme }) => ({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export interface ChatMessageSourcesSlots {
  /** The root container element. @default 'div' */
  root?: React.ElementType;
  /** The label element shown above the list. @default 'p' */
  label?: React.ElementType;
  /** The ordered list wrapping source items. @default 'ol' */
  list?: React.ElementType;
}

export interface ChatMessageSourcesSlotProps {
  root?: SlotComponentPropsFromProps<'div', {}, {}>;
  label?: SlotComponentPropsFromProps<'p', {}, {}>;
  list?: SlotComponentPropsFromProps<'ol', {}, {}>;
}

export interface ChatMessageSourcesProps {
  /**
   * Label displayed above the list of sources.
   * @default 'Sources'
   */
  label?: string;
  children?: React.ReactNode;
  className?: string;
  classes?: Partial<ChatMessageSourcesClasses>;
  slots?: ChatMessageSourcesSlots;
  slotProps?: ChatMessageSourcesSlotProps;
}

type ChatMessageSourcesComponent = ((
  props: ChatMessageSourcesProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

const ChatMessageSources = React.forwardRef(function ChatMessageSources(
  inProps: ChatMessageSourcesProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatMessageSources' });
  const {
    label = 'Sources',
    children,
    className,
    classes: classesProp,
    slots,
    slotProps,
    ...other
  } = props;
  const classes = useChatMessageSourcesUtilityClasses(classesProp);

  const Root = slots?.root ?? ChatMessageSourcesRootStyled;
  const Label = slots?.label ?? ChatMessageSourcesLabelStyled;
  const List = slots?.list ?? ChatMessageSourcesListStyled;

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

  const labelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.label,
    ownerState: {},
    additionalProps: {
      className: classes.label,
    },
  });

  const listProps = useSlotProps({
    elementType: List,
    externalSlotProps: slotProps?.list,
    ownerState: {},
    additionalProps: {
      className: classes.list,
    },
  });

  return (
    <Root {...rootProps}>
      <Label {...labelProps}>{label}</Label>
      <List {...listProps}>{children}</List>
    </Root>
  );
}) as ChatMessageSourcesComponent;

ChatMessageSources.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Label displayed above the list of sources.
   * @default 'Sources'
   */
  label: PropTypes.string,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
} as any;

export { ChatMessageSources };
