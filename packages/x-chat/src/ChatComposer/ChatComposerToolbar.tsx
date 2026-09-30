'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { SxProps, Theme } from '@mui/system';
import { ComposerToolbar } from '@mui/x-chat-headless';
import type { ComposerToolbarProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatComposerUtilityClasses } from './chatComposerClasses';
import type { ChatComposerClasses } from './chatComposerClasses';
import { mergeSlotProps } from '../internals/mergeSlotProps';

const useThemeProps = createUseThemeProps('MuiChatComposerToolbar');

export interface ChatComposerToolbarProps extends ComposerToolbarProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatComposerClasses>;
}

const ChatComposerToolbarStyled = styled('div', {
  name: 'MuiChatComposer',
  slot: 'Toolbar',
  overridesResolver: (_, styles) => styles.toolbar,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(0.5),
}));

const ChatComposerToolbar = React.forwardRef<HTMLDivElement, ChatComposerToolbarProps>(
  function ChatComposerToolbar(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatComposerToolbar' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatComposerUtilityClasses(classesProp);

    return (
      <ComposerToolbar
        ref={ref}
        {...other}
        slots={{
          ...slots,
          toolbar: slots?.toolbar ?? ChatComposerToolbarStyled,
        }}
        slotProps={{
          ...slotProps,
          toolbar: mergeSlotProps(
            {
              className: clsx(classes.toolbar, className),
              sx,
            },
            slotProps?.toolbar,
          ) as any,
        }}
      />
    );
  },
);

ChatComposerToolbar.propTypes /* remove-proptypes */ = {
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

export { ChatComposerToolbar };
