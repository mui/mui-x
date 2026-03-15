'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useComposerContext } from './internals/ComposerContext';
import { type ComposerAttachButtonOwnerState } from './composer.types';

export interface ComposerAttachButtonSlots {
  root: React.ElementType;
  input: React.ElementType;
}

export interface ComposerAttachButtonSlotProps {
  root?: SlotComponentProps<'button', {}, ComposerAttachButtonOwnerState>;
  input?: SlotComponentProps<'input', {}, ComposerAttachButtonOwnerState>;
}

export interface ComposerAttachButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
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
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const ownerState: ComposerAttachButtonOwnerState = {
    isSubmitting: composer.isSubmitting,
    hasValue: composer.hasValue,
    isStreaming: composer.isStreaming,
    attachmentCount: composer.attachmentCount,
  };
  const Root = slots?.root ?? 'button';
  const Input = slots?.input ?? 'input';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  }) as React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.RefAttributes<HTMLButtonElement>;
  const inputProps = useSlotProps({
    elementType: Input,
    externalSlotProps: slotProps?.input,
    ownerState,
    additionalProps: {
      hidden: true,
      multiple: true,
      ref: inputRef,
      type: 'file',
    },
  }) as React.InputHTMLAttributes<HTMLInputElement> &
    React.RefAttributes<HTMLInputElement>;
  const externalOnClick = rootProps.onClick as React.MouseEventHandler<HTMLButtonElement> | undefined;
  const externalOnChange = inputProps.onChange as React.ChangeEventHandler<HTMLInputElement> | undefined;

  return (
    <React.Fragment>
      <Input
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
      <Root
        {...rootProps}
        aria-label={rootProps['aria-label'] ?? 'Add attachment'}
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
