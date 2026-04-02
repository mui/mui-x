'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { ComposerRoot, type ComposerRootProps, type ChatAttachmentsConfig } from '@mui/x-chat-unstyled';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatComposerUtilityClasses, type ChatComposerClasses } from './chatComposerClasses';
import { ChatComposerTextArea } from './ChatComposerTextArea';
import { ChatComposerToolbar } from './ChatComposerToolbar';
import { ChatComposerSendButton } from './ChatComposerSendButton';
import { ChatComposerAttachButton } from './ChatComposerAttachButton';
import { ChatComposerAttachmentList } from './ChatComposerAttachmentList';
import DefaultSendIcon from '../icons/DefaultSendIcon';
import DefaultAttachIcon from '../icons/DefaultAttachIcon';

const useThemeProps = createUseThemeProps('MuiChatComposer');

export interface ChatComposerFeatures {
  /**
   * Whether to enable attachment functionality (attach button and attachment preview list),
   * and optionally configure attachment validation constraints.
   *
   * - `true` – enable with no restrictions (default).
   * - `false` – disable attachment functionality entirely.
   * - `{ acceptedMimeTypes, maxFileCount, maxFileSize, onAttachmentReject }` – enable
   *   with the specified validation rules.
   * @default true
   */
  attachments?: boolean | ChatAttachmentsConfig;
}

export interface ChatComposerProps extends ComposerRootProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatComposerClasses>;
  /**
   * Feature flags to control composer capabilities.
   */
  features?: ChatComposerFeatures;
}

const ChatComposerStyled = styled('form', {
  name: 'MuiChatComposer',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  margin: theme.spacing(1),
  padding: theme.spacing(1, 1.5),
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  borderRadius: (theme.shape.borderRadius as number) * 3,
  backgroundColor: (theme.vars || theme).palette.action.hover,
  boxSizing: 'border-box',
  flexShrink: 0,
}));

const DefaultComposerContent = React.memo(function DefaultComposerContent({
  features,
}: {
  features?: ChatComposerFeatures;
}) {
  const showAttachments = features?.attachments !== false;

  return (
    <React.Fragment>
      {showAttachments && <ChatComposerAttachmentList />}
      <ChatComposerTextArea />
      <ChatComposerToolbar>
        {showAttachments && (
          <ChatComposerAttachButton>
            <DefaultAttachIcon />
          </ChatComposerAttachButton>
        )}
        <ChatComposerSendButton>
          <DefaultSendIcon />
        </ChatComposerSendButton>
      </ChatComposerToolbar>
    </React.Fragment>
  );
});

(DefaultComposerContent as any).propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  features: PropTypes.shape({
    attachments: PropTypes.oneOfType([
      PropTypes.shape({
        acceptedMimeTypes: PropTypes.arrayOf(PropTypes.string),
        maxFileCount: PropTypes.number,
        maxFileSize: PropTypes.number,
        onAttachmentReject: PropTypes.func,
      }),
      PropTypes.bool,
    ]),
  }),
};

const ChatComposer = React.forwardRef<HTMLFormElement, ChatComposerProps>(
  function ChatComposer(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatComposer' });
    const {
      slots,
      slotProps,
      className,
      classes: classesProp,
      sx,
      children,
      features,
      ...other
    } = props;
    const classes = useChatComposerUtilityClasses(classesProp);
    const attachmentConfig =
      typeof features?.attachments === 'object' ? features.attachments : undefined;

    return (
      <ComposerRoot
        ref={ref}
        {...other}
        attachmentConfig={attachmentConfig}
        slots={{
          root: slots?.root ?? ChatComposerStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(classes.root, className),
            sx,
            ...slotProps?.root,
          } as any,
        }}
      >
        {children ?? <DefaultComposerContent features={features} />}
      </ComposerRoot>
    );
  },
);

ChatComposer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  /**
   * Feature flags to control composer capabilities.
   */
  features: PropTypes.shape({
    attachments: PropTypes.oneOfType([
      PropTypes.shape({
        acceptedMimeTypes: PropTypes.arrayOf(PropTypes.string),
        maxFileCount: PropTypes.number,
        maxFileSize: PropTypes.number,
        onAttachmentReject: PropTypes.func,
      }),
      PropTypes.bool,
    ]),
  }),
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatComposer };
