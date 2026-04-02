'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import {
  ComposerHelperText,
  type ComposerHelperTextProps,
  type ComposerHelperTextOwnerState,
} from '@mui/x-chat-unstyled';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatComposerUtilityClasses, type ChatComposerClasses } from './chatComposerClasses';

const useThemeProps = createUseThemeProps('MuiChatComposer');

export interface ChatComposerHelperTextProps extends ComposerHelperTextProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatComposerClasses>;
}

interface ChatComposerHelperTextOwnerState extends ComposerHelperTextOwnerState {
  error: boolean;
}

const ChatComposerHelperTextStyled = styled('p', {
  name: 'MuiChatComposer',
  slot: 'HelperText',
  overridesResolver: (_, styles) => styles.helperText,
})<{ ownerState?: ChatComposerHelperTextOwnerState }>(({ theme, ownerState }) => ({
  margin: 0,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: theme.typography.caption.lineHeight,
  color: ownerState?.error
    ? (theme.vars || theme).palette.error.main
    : (theme.vars || theme).palette.text.secondary,
  paddingInline: theme.spacing(0.5),
}));

const ChatComposerHelperText = React.forwardRef<HTMLParagraphElement, ChatComposerHelperTextProps>(
  function ChatComposerHelperText(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatComposer' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatComposerUtilityClasses(classesProp);

    return (
      <ComposerHelperText
        ref={ref}
        {...other}
        slots={{
          helperText: slots?.helperText ?? ChatComposerHelperTextStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          helperText: {
            className: clsx(classes.helperText, className),
            sx,
            ...slotProps?.helperText,
          } as any,
        }}
      />
    );
  },
);

ChatComposerHelperText.propTypes = {
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

export { ChatComposerHelperText };
