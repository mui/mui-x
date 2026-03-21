'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { useConversationInputContext } from './internals/ConversationInputContext';
import { type ConversationInputOwnerState } from './conversation-input.types';

export interface ConversationInputLabelSlots {
  label: React.ElementType;
}

export interface ConversationInputLabelSlotProps {
  label?: SlotComponentProps<'label', {}, ConversationInputOwnerState>;
}

export interface ConversationInputLabelProps extends Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  'children'
> {
  /**
   * The `id` of the textarea this label is associated with.
   * Passed directly to the native `htmlFor` attribute.
   * When provided, the label is semantically linked to the textarea so that
   * clicking the label focuses the input and screen readers announce it on focus.
   */
  htmlFor?: string;
  /**
   * Label text. Falls back to the locale text `composerInputAriaLabel` when
   * omitted, so the default is consistent with the textarea's `aria-label`.
   */
  children?: React.ReactNode;
  slots?: Partial<ConversationInputLabelSlots>;
  slotProps?: ConversationInputLabelSlotProps;
}

type ConversationInputLabelComponent = ((
  props: ConversationInputLabelProps & React.RefAttributes<HTMLLabelElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * A `<label>` element for the conversation input textarea.
 *
 * Pair this with `ConversationInput.TextArea` to create a proper
 * label-for-input association. This lets screen readers announce the
 * label when the textarea receives focus, and lets users click the label
 * to focus the textarea.
 *
 * ```tsx
 * const textareaId = useId();
 *
 * <ConversationInput.Root>
 *   <ConversationInput.Label htmlFor={textareaId}>
 *     Ask anything
 *   </ConversationInput.Label>
 *   <ConversationInput.TextArea id={textareaId} />
 * </ConversationInput.Root>
 * ```
 *
 * When `children` is omitted the label text falls back to the locale
 * string `composerInputAriaLabel` — the same default used by the textarea's
 * own `aria-label` — so you get consistent announcements without duplication.
 * In that case you may want to visually hide the label while keeping it in
 * the accessibility tree (e.g. via a `.sr-only` utility class).
 */
export const ConversationInputLabel = React.forwardRef(function ConversationInputLabel(
  props: ConversationInputLabelProps,
  ref: React.Ref<HTMLLabelElement>,
) {
  const {
    ownerState: ownerStateProp,
    children,
    slots,
    slotProps,
    ...other
  } = props as ConversationInputLabelProps & { ownerState?: ConversationInputOwnerState };
  void ownerStateProp;

  const composer = useConversationInputContext();
  const localeText = useChatLocaleText();

  const ownerState: ConversationInputOwnerState = {
    isSubmitting: composer.isSubmitting,
    hasValue: composer.hasValue,
    isStreaming: composer.isStreaming,
    attachmentCount: composer.attachmentCount,
    disabled: composer.disabled,
  };

  const Label = slots?.label ?? 'label';
  const labelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.label,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });

  return <Label {...labelProps}>{children ?? localeText.composerInputAriaLabel}</Label>;
}) as ConversationInputLabelComponent;
