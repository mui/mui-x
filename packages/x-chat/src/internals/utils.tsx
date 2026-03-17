import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import type { SlotComponentProps } from '@mui/utils/types';
import type { ChatMessage as ChatMessageModel } from '@mui/x-chat-headless';

export function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function mergeSlotPropsWithClassName<TOwnerState>(
  slotProps: SlotComponentProps<React.ElementType, {}, TOwnerState> | undefined,
  className: string | undefined,
) {
  return (ownerState: TOwnerState) => {
    const resolved = resolveComponentProps(slotProps, ownerState) ?? {};

    return {
      ...resolved,
      className: joinClassNames(className, (resolved as { className?: string }).className),
    };
  };
}

export function createDefaultSlot(Component: React.ElementType, sx?: SxProps<Theme>) {
  return React.forwardRef(function DefaultSlot(
    props: React.HTMLAttributes<HTMLElement> & {
      ownerState?: unknown;
    },
    ref: React.Ref<HTMLElement>,
  ) {
    const { ownerState, ...other } = props;

    return <Component ownerState={ownerState} ref={ref} sx={sx} {...other} />;
  });
}

export function getCopyableText(message: ChatMessageModel | null) {
  if (message == null) {
    return '';
  }

  return message.parts
    .filter(
      (part): part is Extract<ChatMessageModel['parts'][number], { type: 'text' }> =>
        part.type === 'text',
    )
    .map((part) => part.text)
    .join('\n\n')
    .trim();
}
