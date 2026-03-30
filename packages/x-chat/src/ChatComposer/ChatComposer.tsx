'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';

const useThemeProps = createUseThemeProps('MuiChatComposer');
import { SxProps, Theme } from '@mui/system';
import { ComposerRoot, type ComposerRootProps } from '@mui/x-chat-unstyled';
import { useChatComposerUtilityClasses, type ChatComposerClasses } from './chatComposerClasses';

export interface ChatComposerProps extends ComposerRootProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatComposerClasses>;
}

const ChatComposerStyled = styled('form', {
  name: 'MuiChatComposer',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1, 2),
  borderTop: '1px solid',
  borderTopColor: (theme.vars || theme).palette.divider,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  boxSizing: 'border-box',
  flexShrink: 0,
}));

const ChatComposer = React.forwardRef<HTMLFormElement, ChatComposerProps>(
  function ChatComposer(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatComposer' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatComposerUtilityClasses(classesProp);

    return (
      <ComposerRoot
        ref={ref}
        {...other}
        slots={{
          root: slots?.root ?? ChatComposerStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(classes.root, className),
            sx,
            ...slotProps?.root,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        }}
      />
    );
  },
);

ChatComposer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatComposer };
