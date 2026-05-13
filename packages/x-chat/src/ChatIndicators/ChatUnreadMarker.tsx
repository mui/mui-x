'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { UnreadMarker, type UnreadMarkerProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatUnreadMarkerUtilityClasses,
  type ChatUnreadMarkerClasses,
} from './chatUnreadMarkerClasses';

const useThemeProps = createUseThemeProps('MuiChatUnreadMarker');

export interface ChatUnreadMarkerProps extends UnreadMarkerProps {
  className?: string;
  classes?: Partial<ChatUnreadMarkerClasses>;
}

const ChatUnreadMarkerStyled = styled('div', {
  name: 'MuiChatUnreadMarker',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(0.5),
}));

const ChatUnreadMarkerLabelStyled = styled('div', {
  name: 'MuiChatUnreadMarker',
  slot: 'Label',
  overridesResolver: (_, styles) => styles.label,
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.primary.main,
  whiteSpace: 'nowrap',
}));

const ChatUnreadMarker = React.forwardRef<HTMLDivElement, ChatUnreadMarkerProps>(
  function ChatUnreadMarker(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatUnreadMarker' });
    const { slots, slotProps, className, classes: classesProp, ...other } = props;
    const classes = useChatUnreadMarkerUtilityClasses(classesProp);

    return (
      <UnreadMarker
        ref={ref}
        {...other}
        slots={{
          root: slots?.root ?? ChatUnreadMarkerStyled,
          label: slots?.label ?? ChatUnreadMarkerLabelStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(classes.root, className),
            ...(slotProps?.root as object),
          } as any,
          label: {
            className: classes.label,
            ...(slotProps?.label as object),
          } as any,
        }}
      />
    );
  },
);

ChatUnreadMarker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  index: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.node,
  messageId: PropTypes.string.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
} as any;

export { ChatUnreadMarker };
