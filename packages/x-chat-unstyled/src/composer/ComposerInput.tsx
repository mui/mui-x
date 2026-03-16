'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChat } from '@mui/x-chat-headless';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { useComposerContext } from './internals/ComposerContext';
import { type ComposerInputOwnerState } from './composer.types';

export interface ComposerInputSlots {
  input: React.ElementType;
}

export interface ComposerInputSlotProps {
  input?: SlotComponentProps<'textarea', {}, ComposerInputOwnerState>;
}

export interface ComposerInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children' | 'value' | 'defaultValue' | 'onChange'> {
  slots?: Partial<ComposerInputSlots>;
  slotProps?: ComposerInputSlotProps;
}

type ComposerInputComponent = ((
  props: ComposerInputProps & React.RefAttributes<HTMLTextAreaElement>,
) => React.JSX.Element) & { propTypes?: any };

function syncTextareaHeight(textarea: HTMLTextAreaElement | null) {
  if (!textarea) {
    return;
  }

  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

export const ComposerInput = React.forwardRef(function ComposerInput(
  props: ComposerInputProps,
  ref: React.Ref<HTMLTextAreaElement>,
) {
  const { slots, slotProps, ...other } = props;
  const { activeConversationId } = useChat();
  const composer = useComposerContext();
  const localeText = useChatLocaleText();
  const ownerState: ComposerInputOwnerState = {
    isSubmitting: composer.isSubmitting,
    hasValue: composer.hasValue,
    isStreaming: composer.isStreaming,
    attachmentCount: composer.attachmentCount,
  };
  const Input = slots?.input ?? 'textarea';
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const handleRef = useForkRef(ref, inputRef);
  const rootProps = useSlotProps({
    elementType: Input,
    externalSlotProps: slotProps?.input,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref: handleRef,
      value: composer.value,
    },
  }) as React.TextareaHTMLAttributes<HTMLTextAreaElement> &
    React.RefAttributes<HTMLTextAreaElement>;
  const externalOnChange = rootProps.onChange as React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
  const externalOnKeyDown = rootProps.onKeyDown as React.KeyboardEventHandler<HTMLTextAreaElement> | undefined;
  const externalOnCompositionStart = rootProps.onCompositionStart as
    | React.CompositionEventHandler<HTMLTextAreaElement>
    | undefined;
  const externalOnCompositionEnd = rootProps.onCompositionEnd as
    | React.CompositionEventHandler<HTMLTextAreaElement>
    | undefined;
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
      placeholder={rootProps.placeholder ?? localeText.composerInputPlaceholder}
      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
        externalOnChange?.(event);

        if (event.defaultPrevented) {
          return;
        }

        composer.setValue(event.target.value);
      }}
      onCompositionEnd={(event: React.CompositionEvent<HTMLTextAreaElement>) => {
        externalOnCompositionEnd?.(event);

        if (event.defaultPrevented) {
          return;
        }

        composer.setComposerIsComposing(false);
      }}
      onCompositionStart={(event: React.CompositionEvent<HTMLTextAreaElement>) => {
        externalOnCompositionStart?.(event);

        if (event.defaultPrevented) {
          return;
        }

        composer.setComposerIsComposing(true);
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        externalOnKeyDown?.(event);

        if (
          event.defaultPrevented ||
          event.key !== 'Enter' ||
          event.shiftKey ||
          event.nativeEvent.isComposing
        ) {
          return;
        }

        event.preventDefault();
        void composer.submit();
      }}
    />
  );
}) as ComposerInputComponent;
