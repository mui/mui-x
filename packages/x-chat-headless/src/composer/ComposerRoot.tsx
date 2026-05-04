'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChatComposer } from '../hooks/useChatComposer';
import { useChatStatus } from '../hooks/useChatStatus';
import { useChatStore } from '../hooks/useChatStore';
import type { ChatAttachmentsConfig } from '../types/chat-entities';
import { getDataAttributes } from '../internals/getDataAttributes';
import { ComposerContextProvider } from './internals/ComposerContext';
import { type ComposerRootOwnerState } from './composer.types';

export interface ComposerRootSlots {
  root: React.ElementType;
}

export interface ComposerRootSlotProps {
  root?: SlotComponentProps<'form', {}, ComposerRootOwnerState>;
}

export interface ComposerRootProps extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> {
  disabled?: boolean;
  /**
   * Configuration for attachment validation constraints.
   * When provided, file attachments are validated against these rules.
   */
  attachmentConfig?: ChatAttachmentsConfig;
  slots?: Partial<ComposerRootSlots>;
  slotProps?: ComposerRootSlotProps;
}

type ComposerRootComponent = ((
  props: ComposerRootProps & React.RefAttributes<HTMLFormElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ComposerRoot = React.forwardRef(function ComposerRoot(
  props: ComposerRootProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const { slots, slotProps, children, disabled = false, attachmentConfig, ...other } = props;
  const composer = useChatComposer();
  const status = useChatStatus();
  const store = useChatStore();
  const ownerState = React.useMemo<ComposerRootOwnerState>(
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
      removeAttachment: composer.removeAttachment,
      attachments: composer.attachments,
      attachmentConfig,
      error: status.error,
      setComposerIsComposing: store.setComposerIsComposing,
    }),
    [
      attachmentConfig,
      composer.addAttachment,
      composer.removeAttachment,
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
    <ComposerContextProvider value={contextValue}>
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
    </ComposerContextProvider>
  );
}) as ComposerRootComponent;
