'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import {
  ComposerRoot,
  useChatVariant,
  type ComposerRootProps,
  type ChatAttachmentsConfig,
  type ChatVariant,
} from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  chatComposerClasses,
  useChatComposerUtilityClasses,
  type ChatComposerClasses,
} from './chatComposerClasses';
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
  /**
   * The visual layout variant of the composer.
   * - `'default'` – Stacked layout: attachment list, textarea, then toolbar below.
   * - `'compact'` – Inline layout: start actions, textarea, end actions in a single row.
   *
   * When omitted, inherits from the nearest `ChatVariantProvider` (e.g. set by `ChatBox`).
   * @default 'default'
   */
  variant?: ChatVariant;
}

const ChatComposerStyled = styled('form', {
  name: 'MuiChatComposer',
  slot: 'Root',
  overridesResolver: (props, styles) => [
    styles.root,
    props.ownerState?.disabled && styles.disabled,
  ],
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
  gap: theme.spacing(0.5),
  padding: theme.spacing(1, 1.5),
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  borderRadius: (theme.vars || theme).shape.borderRadius,
  backgroundColor: (theme.vars || theme).palette.action.hover,
  boxSizing: 'border-box',
  flexShrink: 0,
  margin: theme.spacing(0, 1, 1),
  transition: theme.transitions.create(['border-color', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
  '&:focus-within:not([data-disabled])': {
    borderColor: (theme.vars || theme).palette.primary.main,
    boxShadow: `0 0 0 1px ${(theme.vars || theme).palette.primary.main}`,
  },
  '&[data-disabled]': {
    backgroundColor: (theme.vars || theme).palette.action.disabledBackground,
    opacity: (theme.vars || theme).palette.action.disabledOpacity,
    pointerEvents: 'none',
  },
  [`&.${chatComposerClasses.variantCompact}`]: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    borderRadius: (theme.vars || theme).shape.borderRadius,
    backgroundColor: (theme.vars || theme).palette.background.paper,
    border: '1px solid',
    borderColor: 'rgba(0,0,0,0.23)',
    ...theme.applyStyles('dark', {
      borderColor: 'rgba(255,255,255,0.23)',
    }),
    margin: theme.spacing(0, 1, 1),
    padding: theme.spacing(0.5),
    boxShadow: 'none',
    '&:focus-within:not([data-disabled])': {
      borderColor: (theme.vars || theme).palette.primary.main,
      boxShadow: `0 0 0 1px ${(theme.vars || theme).palette.primary.main}`,
    },
    [`& .${chatComposerClasses.attachmentList}`]: {
      flexBasis: '100%',
      order: -1,
    },
    [`& .${chatComposerClasses.attachButton}`]: {
      borderRadius: '50%',
      width: 36,
      height: 36,
    },
    [`& .${chatComposerClasses.sendButton}`]: {
      borderRadius: (theme.vars || theme).shape.borderRadius,
      width: 36,
      height: 36,
      padding: 0,
      backgroundColor: (theme.vars || theme).palette.primary.main,
      color: (theme.vars || theme).palette.primary.contrastText,
      '&:disabled': {
        backgroundColor: (theme.vars || theme).palette.primary.main,
        color: (theme.vars || theme).palette.primary.contrastText,
        opacity: (theme.vars || theme).palette.action.disabledOpacity,
        cursor: 'not-allowed',
      },
    },
  },
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

// @ts-expect-error React.memo typing doesn't include propTypes

DefaultComposerContent.propTypes = {
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
} as any;

const CompactComposerContent = React.memo(function CompactComposerContent({
  features,
}: {
  features?: ChatComposerFeatures;
}) {
  const showAttachments = features?.attachments !== false;

  return (
    <React.Fragment>
      {showAttachments && <ChatComposerAttachmentList />}
      {showAttachments && (
        <ChatComposerAttachButton>
          <DefaultAttachIcon />
        </ChatComposerAttachButton>
      )}
      <ChatComposerTextArea maxRows={5} />
      <ChatComposerSendButton>
        <DefaultSendIcon />
      </ChatComposerSendButton>
    </React.Fragment>
  );
});

// @ts-expect-error React.memo typing doesn't include propTypes

CompactComposerContent.propTypes = {
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
} as any;

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
      variant: variantProp,
      disabled = false,
      ...other
    } = props;
    const contextVariant = useChatVariant();
    const variant = variantProp ?? contextVariant;
    const isCompact = variant === 'compact';
    const classes = useChatComposerUtilityClasses(classesProp);
    const attachmentConfig =
      typeof features?.attachments === 'object' ? features.attachments : undefined;

    const defaultContent = isCompact ? (
      <CompactComposerContent features={features} />
    ) : (
      <DefaultComposerContent features={features} />
    );

    return (
      <ComposerRoot
        ref={ref}
        disabled={disabled}
        {...other}
        attachmentConfig={attachmentConfig}
        slots={{
          root: slots?.root ?? ChatComposerStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(
              classes.root,
              isCompact && classes.variantCompact,
              disabled && classes.disabled,
              className,
            ),
            sx,
            ...slotProps?.root,
          } as any,
        }}
      >
        {children ?? defaultContent}
      </ComposerRoot>
    );
  },
);

ChatComposer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Configuration for attachment validation constraints.
   * When provided, file attachments are validated against these rules.
   */
  attachmentConfig: PropTypes.shape({
    acceptedMimeTypes: PropTypes.arrayOf(PropTypes.string),
    maxFileCount: PropTypes.number,
    maxFileSize: PropTypes.number,
    onAttachmentReject: PropTypes.func,
  }),
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
  /**
   * The visual layout variant of the composer.
   * - `'default'` – Stacked layout: attachment list, textarea, then toolbar below.
   * - `'compact'` – Inline layout: start actions, textarea, end actions in a single row.
   *
   * When omitted, inherits from the nearest `ChatVariantProvider` (e.g. set by `ChatBox`).
   * @default 'default'
   */
  variant: PropTypes.oneOf(['compact', 'default']),
} as any;

export { ChatComposer };
