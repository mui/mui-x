'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import type {
  ChatFileMessagePart,
  ChatPartRenderer,
  ChatPartRendererProps,
  ChatRole,
} from '@mui/x-chat-headless';

export interface FilePartOwnerState {
  image: boolean;
  mediaType: string;
  messageId: string;
  role: ChatRole;
}

export interface FilePartSlots {
  root: React.ElementType;
  preview: React.ElementType;
  link: React.ElementType;
  filename: React.ElementType;
}

export interface FilePartSlotProps {
  root?: SlotComponentProps<'div', {}, FilePartOwnerState>;
  preview?: SlotComponentProps<'img', {}, FilePartOwnerState>;
  link?: SlotComponentProps<'a', {}, FilePartOwnerState>;
  filename?: SlotComponentProps<'span', {}, FilePartOwnerState>;
}

export interface FilePartProps extends ChatPartRendererProps<ChatFileMessagePart> {
  className?: string;
  slots?: Partial<FilePartSlots>;
  slotProps?: FilePartSlotProps;
}

export type FilePartExternalProps = Omit<
  FilePartProps,
  'index' | 'message' | 'onToolCall' | 'part'
>;

type FilePartComponent = ((
  props: FilePartProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

function FileIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      focusable="false"
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
    >
      <path d="M6 2h8l4 4v16H6V2Zm8 1.5V7h3.5L14 3.5Z" />
    </svg>
  );
}

export const FilePart = React.forwardRef(function FilePart(
  props: FilePartProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, index, message, onToolCall, part, slots, slotProps, ...other } = props;
  void index;
  void onToolCall;
  const ownerState = React.useMemo<FilePartOwnerState>(
    () => ({
      image: part.mediaType.startsWith('image/'),
      mediaType: part.mediaType,
      messageId: message.id,
      role: message.role,
    }),
    [message.id, message.role, part.mediaType],
  );
  const Root = slots?.root ?? 'div';
  const Preview = slots?.preview ?? 'img';
  const LinkSlot = slots?.link ?? 'a';
  const Filename = slots?.filename ?? 'span';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      className,
    },
  });
  const previewProps = useSlotProps({
    elementType: Preview,
    externalSlotProps: slotProps?.preview,
    ownerState,
  });
  const linkProps = useSlotProps({
    elementType: LinkSlot,
    externalSlotProps: slotProps?.link,
    ownerState,
  });
  const filenameProps = useSlotProps({
    elementType: Filename,
    externalSlotProps: slotProps?.filename,
    ownerState,
  });

  return (
    <Root {...rootProps}>
      {ownerState.image ? (
        <LinkSlot href={part.url} rel="noreferrer noopener" target="_blank" {...linkProps}>
          <Preview alt={part.filename ?? ''} src={part.url} {...previewProps} />
        </LinkSlot>
      ) : (
        <LinkSlot href={part.url} rel="noreferrer noopener" target="_blank" {...linkProps}>
          <FileIcon />
          <Filename {...filenameProps}>{part.filename ?? part.url}</Filename>
        </LinkSlot>
      )}
    </Root>
  );
}) as FilePartComponent;

export function createFilePartRenderer(
  defaultProps: FilePartExternalProps = {},
): ChatPartRenderer<ChatFileMessagePart> {
  return function FilePartRendererFn(rendererProps) {
    return <FilePart {...defaultProps} {...rendererProps} />;
  };
}
