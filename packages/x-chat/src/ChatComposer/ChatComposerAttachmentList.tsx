'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import {
  ComposerAttachmentList,
  useComposerContext,
  type ComposerAttachmentListProps,
} from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatComposerUtilityClasses, type ChatComposerClasses } from './chatComposerClasses';
import DefaultCloseIcon from '../icons/DefaultCloseIcon';
import DefaultFileIcon from '../icons/DefaultFileIcon';

const useThemeProps = createUseThemeProps('MuiChatComposerAttachmentList');

export interface ChatComposerAttachmentListProps extends ComposerAttachmentListProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatComposerClasses>;
}

const ChatComposerAttachmentListStyled = styled('div', {
  name: 'MuiChatComposer',
  slot: 'AttachmentList',
  overridesResolver: (_, styles) => styles.attachmentList,
})(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0),
}));

const AttachmentChip = styled('div', {
  name: 'MuiChatComposer',
  slot: 'AttachmentChip',
  skipVariantsResolver: true,
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  maxWidth: 180,
  padding: theme.spacing(0.25, 0.75),
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: theme.typography.caption.lineHeight,
  color: (theme.vars || theme).palette.text.secondary,
}));

const AttachmentThumbnail = styled('img', {
  name: 'MuiChatComposer',
  slot: 'AttachmentThumbnail',
  skipVariantsResolver: true,
})({
  width: 20,
  height: 20,
  objectFit: 'cover',
  borderRadius: 3,
  flexShrink: 0,
});

const AttachmentFileName = styled('span', {
  name: 'MuiChatComposer',
  slot: 'AttachmentFileName',
  skipVariantsResolver: true,
})({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
});

const AttachmentRemoveButton = styled('button', {
  name: 'MuiChatComposer',
  slot: 'AttachmentRemoveButton',
  skipVariantsResolver: true,
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  backgroundColor: 'transparent',
  color: (theme.vars || theme).palette.text.disabled,
  cursor: 'pointer',
  flexShrink: 0,
  fontSize: 12,
  '&:hover': {
    color: (theme.vars || theme).palette.text.primary,
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  '& svg': {
    width: '1em',
    height: '1em',
  },
}));

const AttachmentFileIconWrapper = styled('span', {
  name: 'MuiChatComposer',
  slot: 'AttachmentFileIcon',
  skipVariantsResolver: true,
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  flexShrink: 0,
  fontSize: 16,
  color: (theme.vars || theme).palette.text.disabled,
  '& svg': {
    width: '1em',
    height: '1em',
  },
}));

function DefaultAttachmentListContent() {
  const composer = useComposerContext();

  return (
    <React.Fragment>
      {composer.attachments.map((attachment) => (
        <AttachmentChip key={attachment.localId}>
          {attachment.previewUrl ? (
            <AttachmentThumbnail src={attachment.previewUrl} alt={attachment.file.name} />
          ) : (
            <AttachmentFileIconWrapper>
              <DefaultFileIcon />
            </AttachmentFileIconWrapper>
          )}
          <AttachmentFileName>{attachment.file.name}</AttachmentFileName>
          <AttachmentRemoveButton
            type="button"
            aria-label={`Remove ${attachment.file.name}`}
            onClick={() => composer.removeAttachment(attachment.localId)}
          >
            <DefaultCloseIcon />
          </AttachmentRemoveButton>
        </AttachmentChip>
      ))}
    </React.Fragment>
  );
}

const ChatComposerAttachmentList = React.forwardRef<
  HTMLDivElement,
  ChatComposerAttachmentListProps
>(function ChatComposerAttachmentList(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatComposerAttachmentList' });
  const { slots, slotProps, className, classes: classesProp, sx, children, ...other } = props;
  const classes = useChatComposerUtilityClasses(classesProp);

  return (
    <ComposerAttachmentList
      ref={ref}
      {...other}
      slots={{
        attachmentList: slots?.attachmentList ?? ChatComposerAttachmentListStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        attachmentList: {
          className: clsx(classes.attachmentList, className),
          sx,
          ...(slotProps?.attachmentList as object),
        } as any,
      }}
    >
      {children ?? <DefaultAttachmentListContent />}
    </ComposerAttachmentList>
  );
});

ChatComposerAttachmentList.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatComposerAttachmentList };
