'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { MessageActions, type MessageActionsProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatMessageUtilityClasses } from './chatMessageClasses';
import { mergeSlotProps } from '../internals/mergeSlotProps';

const useThemeProps = createUseThemeProps('MuiChatMessageActions');

export interface ChatMessageActionsProps extends MessageActionsProps {
  className?: string;
  sx?: SxProps<Theme>;
}

const ChatMessageActionsStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Actions',
  overridesResolver: (_, styles) => styles.actions,
})<{ ownerState?: { role?: string; isOwnMessage?: boolean } }>(({ theme, ownerState }) => ({
  gridArea: 'actions',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  // `visibility: hidden` (not just opacity) removes the action buttons from
  // the tab order and from hit-testing while hidden, so tabbing through the
  // chat never stops on an invisible control. Actions are revealed on hover
  // (mouse), when the user drills into the focused message with Enter
  // (`data-actionable` set by the roving message list), or while focus is
  // inside the actions themselves. Visibility flips at the end of the
  // opacity fade when hiding, and immediately when revealing.
  opacity: 0,
  visibility: 'hidden',
  transition: theme.transitions.create(['opacity', 'visibility'], {
    duration: theme.transitions.duration.short,
  }),
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
  '.MuiChatMessage-root:hover &, .MuiChatMessage-root[data-actionable="true"] &, &:focus-within': {
    opacity: 1,
    visibility: 'visible',
  },
  ...(ownerState?.isOwnMessage && {
    justifySelf: 'end',
  }),
  backgroundColor: (theme.vars || theme).palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: (theme.vars || theme).shadows[1],
  padding: theme.spacing(0.25),
  '& .MuiIconButton-root': {
    padding: theme.spacing(0.5),
  },
  '& .MuiSvgIcon-root': {
    fontSize: theme.typography.pxToRem(16),
  },
}));

const ChatMessageActions = React.forwardRef<HTMLDivElement, ChatMessageActionsProps>(
  function ChatMessageActions(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessageActions' });
    // Drop a JS/theme-injected `classes` (not a prop on this sub-part — it shares
    // the `MuiChatMessage-*` namespace) so it can't leak onto the DOM via `...other`.
    const {
      slots,
      slotProps,
      className,
      sx,
      classes: classesProp,
      ...other
    } = props as ChatMessageActionsProps & { classes?: unknown };
    void classesProp;
    const classes = useChatMessageUtilityClasses(undefined);

    return (
      <MessageActions
        ref={ref}
        {...other}
        slots={{
          ...slots,
          actions: slots?.actions ?? ChatMessageActionsStyled,
        }}
        slotProps={{
          ...slotProps,
          actions: mergeSlotProps(
            {
              className: clsx(classes.actions, className),
              sx,
            },
            slotProps?.actions,
          ) as any,
        }}
      />
    );
  },
);

ChatMessageActions.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatMessageActions };
