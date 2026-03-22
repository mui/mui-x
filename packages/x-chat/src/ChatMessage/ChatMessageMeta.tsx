'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';

const useThemeProps = createUseThemeProps('MuiChatMessage');
import { SxProps, Theme } from '@mui/system';
import { MessageMeta, type MessageMetaProps } from '@mui/x-chat-unstyled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';

export interface ChatMessageMetaProps extends MessageMetaProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageClasses>;
}

const ChatMessageMetaStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Meta',
  overridesResolver: (_, styles) => styles.meta,
})(({ theme }) => ({
  gridArea: 'meta',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.disabled,
  lineHeight: 1.4,
  minHeight: '1.2em',
}));

const ChatMessageMeta = React.forwardRef<HTMLDivElement, ChatMessageMetaProps>(
  function ChatMessageMeta(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatMessageUtilityClasses(classesProp);

    return (
      <MessageMeta
        ref={ref}
        {...other}
        slots={{
          meta: slots?.meta ?? ChatMessageMetaStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          meta: {
            className: clsx(classes.meta, className),
            sx,
            ...(slotProps?.meta as object),
          } as any,
        }}
      />
    );
  },
);

ChatMessageMeta.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatMessageMeta };
