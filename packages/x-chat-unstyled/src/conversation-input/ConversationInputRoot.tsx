'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChatComposer, useChatStatus, useChatStore } from '@mui/x-chat-headless';
import { getDataAttributes } from '../internals/getDataAttributes';
import { ConversationInputContextProvider } from './internals/ConversationInputContext';
import { type ConversationInputRootOwnerState } from './conversation-input.types';

export interface ConversationInputRootSlots {
  root: React.ElementType;
}

export interface ConversationInputRootSlotProps {
  root?: SlotComponentProps<'form', {}, ConversationInputRootOwnerState>;
}

export interface ConversationInputRootProps extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> {
  disabled?: boolean;
  slots?: Partial<ConversationInputRootSlots>;
  slotProps?: ConversationInputRootSlotProps;
}

type ConversationInputRootComponent = ((
  props: ConversationInputRootProps & React.RefAttributes<HTMLFormElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationInputRoot = React.forwardRef(function ConversationInputRoot(
  props: ConversationInputRootProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const { slots, slotProps, children, disabled = false, ...other } = props;
  const composer = useChatComposer();
  const status = useChatStatus();
  const store = useChatStore();
  const ownerState = React.useMemo<ConversationInputRootOwnerState>(
    () => ({
      isSubmitting: composer.isSubmitting,
      hasValue: composer.value.trim() !== '',
      isStreaming: status.isStreaming,
      attachmentCount: composer.attachments.length,
      disabled,
    }),
    [
      composer.attachments.length,
      composer.isSubmitting,
      composer.value,
      status.isStreaming,
      disabled,
    ],
  );
  const contextValue = React.useMemo(
    () => ({
      ...ownerState,
      value: composer.value,
      setValue: composer.setValue,
      submit: composer.submit,
      addAttachment: composer.addAttachment,
      attachments: composer.attachments,
      error: status.error,
      setComposerIsComposing: store.setComposerIsComposing,
    }),
    [
      composer.addAttachment,
      composer.attachments,
      composer.setValue,
      composer.submit,
      composer.value,
      ownerState,
      status.error,
      store,
    ],
  );
  const Root = slots?.root ?? 'form';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      ...getDataAttributes({
        isSubmitting: ownerState.isSubmitting,
        hasValue: ownerState.hasValue,
        isStreaming: ownerState.isStreaming,
        disabled: ownerState.disabled,
      }),
    },
  }) as React.FormHTMLAttributes<HTMLFormElement> & React.RefAttributes<HTMLFormElement>;
  const externalOnSubmit = rootProps.onSubmit as
    | React.FormEventHandler<HTMLFormElement>
    | undefined;

  return (
    <ConversationInputContextProvider value={contextValue}>
      <Root
        {...rootProps}
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          externalOnSubmit?.(event);

          if (event.defaultPrevented) {
            return;
          }

          event.preventDefault();

          if (disabled) {
            return;
          }

          void composer.submit();
        }}
      >
        {children}
      </Root>
    </ConversationInputContextProvider>
  );
}) as ConversationInputRootComponent;
