'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CircularProgress from '@mui/material/CircularProgress';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatTaskUtilityClasses, type ChatTaskClasses } from './chatTaskClasses';

export type ChatTaskStatus = 'pending' | 'running' | 'done' | 'error' | 'skipped';

export interface ChatTaskProps {
  /**
   * The status of the task, which determines the icon shown.
   * @default 'pending'
   */
  status?: ChatTaskStatus;
  /**
   * The label text for the task.
   */
  children?: React.ReactNode;
  /**
   * Optional secondary detail shown below the label.
   */
  detail?: React.ReactNode;
  className?: string;
  classes?: Partial<ChatTaskClasses>;
}

const useThemeProps = createUseThemeProps('MuiChatTask');

const ChatTaskRoot = styled('div', {
  name: 'MuiChatTask',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    styles.root,
    { [`&.${styles.statusPending}`]: styles.statusPending },
    { [`&.${styles.statusRunning}`]: styles.statusRunning },
    { [`&.${styles.statusDone}`]: styles.statusDone },
    { [`&.${styles.statusError}`]: styles.statusError },
    { [`&.${styles.statusSkipped}`]: styles.statusSkipped },
  ],
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  paddingBlock: theme.spacing(0.5),
}));

const ChatTaskIcon = styled('span', {
  name: 'MuiChatTask',
  slot: 'Icon',
  overridesResolver: (_, styles) => styles.icon,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  marginTop: 2,
  fontSize: 16,
  color: (theme.vars || theme).palette.text.disabled,
  '& svg': {
    width: '1em',
    height: '1em',
  },
}));

const ChatTaskLabel = styled('span', {
  name: 'MuiChatTask',
  slot: 'Label',
  overridesResolver: (_, styles) => styles.label,
})(({ theme }) => ({
  ...theme.typography.body2,
  flex: 1,
}));

const ChatTaskDetail = styled('span', {
  name: 'MuiChatTask',
  slot: 'Detail',
  overridesResolver: (_, styles) => styles.detail,
})(({ theme }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
  display: 'block',
  marginTop: theme.spacing(0.25),
}));

// Inline SVG icons — avoids @mui/icons-material dependency

function PendingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function DoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4.5-4.5 1.41-1.41L10 13.67l7.09-7.09L18.5 8l-8.5 8.5z" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  );
}

function SkippedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13H7v-2h10v2z" />
    </svg>
  );
}

function StatusIcon({ status }: { status: ChatTaskStatus }) {
  if (status === 'running') {
    return <CircularProgress size={16} />;
  }
  if (status === 'done') {
    return <DoneIcon />;
  }
  if (status === 'error') {
    return <ErrorIcon />;
  }
  if (status === 'skipped') {
    return <SkippedIcon />;
  }
  return <PendingIcon />;
}

const ChatTask = React.forwardRef<HTMLDivElement, ChatTaskProps>(function ChatTask(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatTask' });
  const { status = 'pending', children, detail, className, classes: classesProp, ...other } = props;
  const classes = useChatTaskUtilityClasses(classesProp);

  const statusClass = {
    pending: classes.statusPending,
    running: classes.statusRunning,
    done: classes.statusDone,
    error: classes.statusError,
    skipped: classes.statusSkipped,
  }[status];

  return (
    <ChatTaskRoot ref={ref} className={clsx(classes.root, statusClass, className)} {...other}>
      <ChatTaskIcon className={classes.icon}>
        <StatusIcon status={status} />
      </ChatTaskIcon>
      <div>
        <ChatTaskLabel className={classes.label}>{children}</ChatTaskLabel>
        {detail != null && <ChatTaskDetail className={classes.detail}>{detail}</ChatTaskDetail>}
      </div>
    </ChatTaskRoot>
  );
});

ChatTask.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The label text for the task.
   */
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Optional secondary detail shown below the label.
   */
  detail: PropTypes.node,
  /**
   * The status of the task, which determines the icon shown.
   * @default 'pending'
   */
  status: PropTypes.oneOf(['done', 'error', 'pending', 'running', 'skipped']),
} as any;

export { ChatTask };
