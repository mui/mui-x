'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import type { ChatAttachmentRejection } from '@mui/x-chat-headless';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { useComposerContext } from './internals/ComposerContext';
import { type ComposerAttachButtonOwnerState } from './composer.types';
import { matchesMimeType } from './internals/matchesMimeType';

export interface ComposerAttachButtonSlots {
  attachButton: React.ElementType;
  attachInput: React.ElementType;
}

export interface ComposerAttachButtonSlotProps {
  attachButton?: SlotComponentProps<'button', {}, ComposerAttachButtonOwnerState>;
  attachInput?: SlotComponentProps<'input', {}, ComposerAttachButtonOwnerState>;
}

export interface ComposerAttachButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  slots?: Partial<ComposerAttachButtonSlots>;
  slotProps?: ComposerAttachButtonSlotProps;
}

type ComposerAttachButtonComponent = ((
  props: ComposerAttachButtonProps & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ComposerAttachButton = React.forwardRef(function ComposerAttachButton(
  props: ComposerAttachButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const { slots, slotProps, ...other } = props;
  const composer = useComposerContext();
  const localeText = useChatLocaleText();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const ownerState: ComposerAttachButtonOwnerState = {
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
  const { attachmentConfig } = composer;
  const acceptAttr = attachmentConfig?.acceptedMimeTypes?.join(',') || undefined;
  const inputProps = useSlotProps({
    elementType: AttachInput,
    externalSlotProps: slotProps?.attachInput,
    ownerState,
    additionalProps: {
      hidden: true,
      multiple: true,
      ref: inputRef,
      type: 'file',
      accept: acceptAttr,
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

          const files = Array.from(event.currentTarget.files ?? []);
          const rejections: ChatAttachmentRejection[] = [];
          const accepted: File[] = [];
          const currentCount = composer.attachmentCount;

          for (const file of files) {
            if (
              attachmentConfig?.acceptedMimeTypes &&
              attachmentConfig.acceptedMimeTypes.length > 0 &&
              !matchesMimeType(file.type, attachmentConfig.acceptedMimeTypes)
            ) {
              rejections.push({ file, reason: 'mime-type' });
              continue;
            }
            if (attachmentConfig?.maxFileSize != null && file.size > attachmentConfig.maxFileSize) {
              rejections.push({ file, reason: 'file-size' });
              continue;
            }
            if (
              attachmentConfig?.maxFileCount != null &&
              currentCount + accepted.length >= attachmentConfig.maxFileCount
            ) {
              rejections.push({ file, reason: 'file-count' });
              continue;
            }
            accepted.push(file);
          }

          if (rejections.length > 0) {
            attachmentConfig?.onAttachmentReject?.(rejections);
          }

          for (const file of accepted) {
            composer.addAttachment(file);
          }

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
}) as ComposerAttachButtonComponent;
