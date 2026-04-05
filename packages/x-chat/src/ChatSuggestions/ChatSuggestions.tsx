'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SuggestionsRoot, type SuggestionsRootProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatSuggestionsUtilityClasses,
  type ChatSuggestionsClasses,
} from './chatSuggestionsClasses';

const useThemeProps = createUseThemeProps('MuiChatSuggestions');

export interface ChatSuggestionsProps extends SuggestionsRootProps {
  className?: string;
  classes?: Partial<ChatSuggestionsClasses>;
}

const ChatSuggestionsRootStyled = styled('div', {
  name: 'MuiChatSuggestions',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  justifyContent: 'center',
  padding: theme.spacing(2),
  pointerEvents: 'auto',
}));

const ChatSuggestionItemStyled = styled('button', {
  name: 'MuiChatSuggestions',
  slot: 'Item',
  overridesResolver: (_, styles) => styles.item,
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.75, 1.5),
  borderRadius: (theme.shape.borderRadius as number) * 4,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.primary,
  fontSize: theme.typography.body2.fontSize,
  fontFamily: theme.typography.fontFamily,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color', 'border-color']),
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
    borderColor: (theme.vars || theme).palette.primary.main,
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

const ChatSuggestions = React.forwardRef<HTMLDivElement, ChatSuggestionsProps>(
  function ChatSuggestions(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatSuggestions' });
    const { slots, slotProps, className, classes: classesProp, ...other } = props;
    const classes = useChatSuggestionsUtilityClasses(classesProp);

    return (
      <SuggestionsRoot
        ref={ref}
        {...other}
        slots={{
          ...slots,
          root: slots?.root ?? ChatSuggestionsRootStyled,
          item: slots?.item ?? ChatSuggestionItemStyled,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(classes.root, className),
            ...(slotProps?.root as object),
          } as any,
          item: {
            className: classes.item,
            ...(slotProps?.item as object),
          } as any,
        }}
      />
    );
  },
);

ChatSuggestions.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Whether to auto-submit when a suggestion is clicked.
   * @default false
   */
  autoSubmit: PropTypes.bool,
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  /**
   * Suggestion items. Strings are normalized to `{ value, label }`.
   * Ignored when `children` are provided.
   */
  suggestions: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
      PropTypes.string,
    ]).isRequired,
  ),
} as any;

export { ChatSuggestions };
