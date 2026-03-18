'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { useConversationInputContext } from './internals/ConversationInputContext';
import { type ConversationInputAttachButtonOwnerState } from './conversation-input.types';

export interface ConversationInputAttachButtonSlots {
  attachButton: React.ElementType;
  attachInput: React.ElementType;
}

export interface ConversationInputAttachButtonSlotProps {
  attachButton?: SlotComponentProps<'button', {}, ConversationInputAttachButtonOwnerState>;
  attachInput?: SlotComponentProps<'input', {}, ConversationInputAttachButtonOwnerState>;
}

export interface ConversationInputAttachButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  slots?: Partial<ConversationInputAttachButtonSlots>;
  slotProps?: ConversationInputAttachButtonSlotProps;
}

type ConversationInputAttachButtonComponent = ((
  props: ConversationInputAttachButtonProps & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationInputAttachButton = React.forwardRef(
  function ConversationInputAttachButton(
    props: ConversationInputAttachButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) {
    const { slots, slotProps, ...other } = props;
    const composer = useConversationInputContext();
    const localeText = useChatLocaleText();
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const ownerState: ConversationInputAttachButtonOwnerState = {
      isSubmitting: composer.isSubmitting,
      hasValue: composer.hasValue,
      isStreaming: composer.isStreaming,
      attachmentCount: composer.attachmentCount,
      disabled: composer.disabled,
    };
    const AttachButton = slots?.attachButton ?? 'button';
    const AttachInput = slots?.attachInput ?? 'input';
    const rootProps = useSlotProps({
      elementType: AttachButton,
      externalSlotProps: slotProps?.attachButton,
      externalForwardedProps: other,
      ownerState,
      additionalProps: {
        ref,
      },
    }) as React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>;
    const inputProps = useSlotProps({
      elementType: AttachInput,
      externalSlotProps: slotProps?.attachInput,
      ownerState,
      additionalProps: {
        hidden: true,
        multiple: true,
        ref: inputRef,
        type: 'file',
      },
    }) as React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>;
    const externalOnClick = rootProps.onClick as
      | React.MouseEventHandler<HTMLButtonElement>
      | undefined;
    const externalOnChange = inputProps.onChange as
      | React.ChangeEventHandler<HTMLInputElement>
      | undefined;

    return (
      <React.Fragment>
        <AttachInput
          {...inputProps}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            externalOnChange?.(event);

            if (event.defaultPrevented) {
              return;
            }

            Array.from(event.currentTarget.files ?? []).forEach((file) => {
              composer.addAttachment(file);
            });
            event.currentTarget.value = '';
          }}
        />
        <AttachButton
          {...rootProps}
          aria-label={rootProps['aria-label'] ?? localeText.composerAttachButtonLabel}
          disabled={Boolean(rootProps.disabled) || ownerState.disabled}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            externalOnClick?.(event);

            if (event.defaultPrevented) {
              return;
            }

            inputRef.current?.click();
          }}
          type={rootProps.type ?? 'button'}
        />
      </React.Fragment>
    );
  },
) as ConversationInputAttachButtonComponent;
