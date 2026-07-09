'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useChat } from '../hooks/useChat';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { useComposerContext } from './internals/ComposerContext';
import { type ComposerTextAreaOwnerState } from './composer.types';

export interface ComposerTextAreaSlots {
  input: React.ElementType;
}

export interface ComposerTextAreaSlotProps {
  input?: SlotComponentPropsFromProps<'textarea', {}, ComposerTextAreaOwnerState>;
}

export interface ComposerTextAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'children' | 'value' | 'defaultValue' | 'onChange'
> {
  slots?: Partial<ComposerTextAreaSlots>;
  slotProps?: ComposerTextAreaSlotProps;
}

type ComposerTextAreaComponent = ((
  props: ComposerTextAreaProps & React.RefAttributes<HTMLTextAreaElement>,
) => React.JSX.Element) & { propTypes?: any };

function syncTextareaHeight(textarea: HTMLTextAreaElement | null) {
  if (!textarea) {
    return;
  }

  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

export const ComposerTextArea = React.forwardRef(function ComposerTextArea(
  props: ComposerTextAreaProps,
  ref: React.Ref<HTMLTextAreaElement>,
) {
  const { slots, slotProps, onKeyDown, onCompositionStart, onCompositionEnd, ...other } = props;
  const { activeConversationId } = useChat();
  const composer = useComposerContext();
  const localeText = useChatLocaleText();
  const ownerState: ComposerTextAreaOwnerState = {
    isSubmitting: composer.isSubmitting,
    hasValue: composer.hasValue,
    isStreaming: composer.isStreaming,
    attachmentCount: composer.attachmentCount,
    disabled: composer.disabled,
  };
  const Input = slots?.input ?? 'textarea';
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const handleRef = useForkRef(ref, inputRef);
  const rootProps = useSlotProps({
    elementType: Input,
    externalSlotProps: slotProps?.input,
    externalForwardedProps: other,
    ownerState,
    getSlotProps: (externalEventHandlers) => ({
      // Spread the consumer's event handlers first so the ones we do not
      // explicitly compose below (onFocus, onBlur, onPaste, onSelect, onInput…)
      // still reach the textarea. `mergeSlotProps`'s getSlotProps branch strips
      // every external handler and only re-adds what this getter returns.
      ...externalEventHandlers,
      ref: handleRef,
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        externalEventHandlers.onChange?.(event);

        if (!event.defaultPrevented) {
          composer.setValue(event.target.value);
        }
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        externalEventHandlers.onKeyDown?.(event);

        if (
          !event.defaultPrevented &&
          event.key === 'Enter' &&
          !event.shiftKey &&
          !event.nativeEvent.isComposing &&
          !composer.disabled
        ) {
          event.preventDefault();
          void composer.submit();
        }
      },
      onCompositionStart: (event: React.CompositionEvent<HTMLTextAreaElement>) => {
        onCompositionStart?.(event);

        if (event.defaultPrevented) {
          return;
        }

        externalEventHandlers.onCompositionStart?.(event);

        if (!event.defaultPrevented) {
          composer.setComposerIsComposing(true);
        }
      },
      onCompositionEnd: (event: React.CompositionEvent<HTMLTextAreaElement>) => {
        onCompositionEnd?.(event);

        if (event.defaultPrevented) {
          return;
        }

        externalEventHandlers.onCompositionEnd?.(event);

        if (!event.defaultPrevented) {
          composer.setComposerIsComposing(false);
        }
      },
    }),
  }) as React.TextareaHTMLAttributes<HTMLTextAreaElement> &
    React.RefAttributes<HTMLTextAreaElement>;
  const previousActiveConversationIdRef = React.useRef(activeConversationId);

  React.useLayoutEffect(() => {
    syncTextareaHeight(inputRef.current);
  }, [composer.value]);

  React.useLayoutEffect(() => {
    const previousActiveConversationId = previousActiveConversationIdRef.current;
    previousActiveConversationIdRef.current = activeConversationId;

    if (
      inputRef.current == null ||
      previousActiveConversationId == null ||
      previousActiveConversationId === activeConversationId
    ) {
      return;
    }

    const activeElement = inputRef.current.ownerDocument.activeElement;

    if (
      activeElement == null ||
      activeElement === inputRef.current.ownerDocument.body ||
      activeElement === inputRef.current.ownerDocument.documentElement ||
      !activeElement.isConnected
    ) {
      inputRef.current.focus();
    }
  }, [activeConversationId]);

  return (
    <Input
      {...rootProps}
      aria-label={
        rootProps['aria-label'] ??
        (rootProps['aria-labelledby'] ? undefined : localeText.composerInputAriaLabel)
      }
      disabled={Boolean(rootProps.disabled) || composer.disabled}
      placeholder={rootProps.placeholder ?? localeText.composerInputPlaceholder}
      value={composer.value}
    />
  );
}) as ComposerTextAreaComponent;
