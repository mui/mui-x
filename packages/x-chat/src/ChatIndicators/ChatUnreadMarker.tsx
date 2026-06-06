'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import Chip from '@mui/material/Chip';
import { UnreadMarker, type UnreadMarkerProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { mergeSlotProps } from '../internals/mergeSlotProps';
import {
  useChatUnreadMarkerUtilityClasses,
  type ChatUnreadMarkerClasses,
} from './chatUnreadMarkerClasses';

const useThemeProps = createUseThemeProps('MuiChatUnreadMarker');

export interface ChatUnreadMarkerProps extends UnreadMarkerProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatUnreadMarkerClasses>;
}

const ChatUnreadMarkerStyled = styled('div', {
  name: 'MuiChatUnreadMarker',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(0.5),
  // Flex-filled rules on either side of the centered chip.
  '&::before, &::after': {
    content: '""',
    flex: 1,
    height: 1,
    backgroundColor: (theme.vars || theme).palette.divider,
  },
}));

// The headless UnreadMarker passes the label text as children, but `Chip`
// renders its `label` prop instead — the text is injected via `slotProps.label`
// from the marker's `ownerState` below.
const ChatUnreadMarkerLabelStyled = styled(Chip, {
  name: 'MuiChatUnreadMarker',
  slot: 'Label',
  overridesResolver: (_, styles) => styles.label,
})({
  flexShrink: 0,
});

const ChatUnreadMarker = React.forwardRef<HTMLDivElement, ChatUnreadMarkerProps>(
  function ChatUnreadMarker(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatUnreadMarker' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatUnreadMarkerUtilityClasses(classesProp);

    return (
      <UnreadMarker
        ref={ref}
        {...other}
        slots={{
          ...slots,
          root: slots?.root ?? ChatUnreadMarkerStyled,
          label: slots?.label ?? ChatUnreadMarkerLabelStyled,
        }}
        slotProps={{
          ...slotProps,
          root: mergeSlotProps(
            {
              className: clsx(classes.root, className),
              sx,
            },
            slotProps?.root,
          ) as any,
          // `Chip` renders its `label` prop, so forward the marker's label text
          // (resolved by the headless component) through `ownerState`.
          label: ((ownerState: { label: React.ReactNode }) => {
            const consumer =
              typeof slotProps?.label === 'function'
                ? slotProps.label(ownerState as any)
                : slotProps?.label;
            return {
              size: 'small',
              label: ownerState.label,
              className: classes.label,
              ...consumer,
            };
          }) as any,
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
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatUnreadMarker };
