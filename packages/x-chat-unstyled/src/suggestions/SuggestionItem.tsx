'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { getDataAttributes } from '../internals/getDataAttributes';
import { useSuggestionsContext } from './internals/SuggestionsContext';
import { type SuggestionItemOwnerState } from './suggestions.types';

export interface SuggestionItemSlots {
  root: React.ElementType;
}

export interface SuggestionItemSlotProps {
  root?: SlotComponentProps<'button', {}, SuggestionItemOwnerState>;
}

export interface SuggestionItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'> {
  slots?: Partial<SuggestionItemSlots>;
  slotProps?: SuggestionItemSlotProps;
  /** The value to pre-fill into the composer when the suggestion is clicked. */
  value: string;
  /** Display label. Falls back to `value`. */
  label?: string;
  /** The index of this item within the suggestions list. */
  index?: number;
  children?: React.ReactNode;
}

type SuggestionItemComponent = ((
  props: SuggestionItemProps & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element) & { propTypes?: any };

export const SuggestionItem = React.forwardRef(function SuggestionItem(
  props: SuggestionItemProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const { slots, slotProps, value, label, index = 0, children, onClick, ...other } = props;
  const context = useSuggestionsContext();
  const displayLabel = label ?? value;

  const ownerState = React.useMemo<SuggestionItemOwnerState>(
    () => ({
      value,
      label: displayLabel,
      index,
    }),
    [value, displayLabel, index],
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented) {
        context?.onSelect(value);
      }
    },
    [context, onClick, value],
  );

  const Root = slots?.root ?? 'button';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      type: 'button' as const,
      onClick: handleClick,
      ...getDataAttributes({
        index,
      }),
    },
  });

  return <Root {...rootProps}>{children ?? displayLabel}</Root>;
}) as SuggestionItemComponent;
