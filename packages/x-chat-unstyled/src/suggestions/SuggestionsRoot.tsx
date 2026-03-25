'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useMessageIds, useChatComposer } from '@mui/x-chat-headless';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { getDataAttributes } from '../internals/getDataAttributes';
import { SuggestionsContext } from './internals/SuggestionsContext';
import { SuggestionItem } from './SuggestionItem';
import { type ChatSuggestion, type SuggestionsRootOwnerState } from './suggestions.types';

function normalizeSuggestion(item: ChatSuggestion | string): ChatSuggestion {
  return typeof item === 'string' ? { value: item } : item;
}

export interface SuggestionsRootSlots {
  root: React.ElementType;
  item: React.ElementType;
}

export interface SuggestionsRootSlotProps {
  root?: SlotComponentProps<'div', {}, SuggestionsRootOwnerState>;
  item?: SlotComponentProps<'button', {}, {}>;
}

export interface SuggestionsRootProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  slots?: Partial<SuggestionsRootSlots>;
  slotProps?: SuggestionsRootSlotProps;
  /**
   * Suggestion items. Strings are normalized to `{ value, label }`.
   * Ignored when `children` are provided.
   */
  suggestions?: Array<ChatSuggestion | string>;
  /**
   * Whether to auto-submit when a suggestion is clicked.
   * @default false
   */
  autoSubmit?: boolean;
  children?: React.ReactNode;
}

type SuggestionsRootComponent = ((
  props: SuggestionsRootProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const SuggestionsRoot = React.forwardRef(function SuggestionsRoot(
  props: SuggestionsRootProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { slots, slotProps, suggestions, autoSubmit = false, children, ...other } = props;
  const messageIds = useMessageIds();
  const { setValue, submit } = useChatComposer();
  const localeText = useChatLocaleText();
  const isEmpty = messageIds.length === 0;

  const normalized = React.useMemo(
    () => (suggestions ?? []).map(normalizeSuggestion),
    [suggestions],
  );

  const suggestionCount = children ? React.Children.count(children) : normalized.length;

  const ownerState = React.useMemo<SuggestionsRootOwnerState>(
    () => ({
      isEmpty,
      suggestionCount,
    }),
    [isEmpty, suggestionCount],
  );

  const onSelect = React.useCallback(
    (value: string) => {
      setValue(value);

      if (autoSubmit) {
        // Defer submit so the store has the new value before validation.
        void Promise.resolve().then(() => submit());
      }
    },
    [autoSubmit, setValue, submit],
  );

  const contextValue = React.useMemo(() => ({ onSelect }), [onSelect]);

  const Root = slots?.root ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      role: 'group',
      'aria-label': localeText.suggestionsLabel,
      ...getDataAttributes({
        empty: isEmpty,
        count: suggestionCount,
      }),
    },
  });

  if (!isEmpty) {
    return null;
  }

  const ItemComponent = slots?.item ?? SuggestionItem;

  return (
    <SuggestionsContext.Provider value={contextValue}>
      <Root {...rootProps}>
        {children ??
          normalized.map((suggestion, index) => (
            <ItemComponent
              key={suggestion.value}
              value={suggestion.value}
              label={suggestion.label}
              index={index}
              {...slotProps?.item}
            />
          ))}
      </Root>
    </SuggestionsContext.Provider>
  );
}) as SuggestionsRootComponent;
