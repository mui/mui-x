'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatPlanUtilityClasses, type ChatPlanClasses } from './chatPlanClasses';
import { ChatTask } from '../ChatTask/ChatTask';

/**
 * A single step in a `ChatPlan`.
 */
export interface PlanStep {
  /** Unique identifier for the step. */
  id: string;
  /** Display label for the step. */
  label: string;
  /** Current execution status of the step. */
  status: 'pending' | 'running' | 'done' | 'error' | 'skipped';
  /** Optional secondary detail text. */
  detail?: string;
}

export interface ChatPlanProps {
  /**
   * Ordered list of steps to render. When provided, `ChatTask` children are
   * generated automatically. Use `children` for the composable API instead.
   */
  steps?: PlanStep[];
  /**
   * Custom content. Ignored when `steps` is provided.
   */
  children?: React.ReactNode;
  /**
   * Optional heading displayed above the step list.
   */
  title?: string;
  className?: string;
  classes?: Partial<ChatPlanClasses>;
}

const useThemeProps = createUseThemeProps('MuiChatPlan');

const ChatPlanRoot = styled('div', {
  name: 'MuiChatPlan',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  padding: theme.spacing(1.5, 2),
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

const ChatPlanTitle = styled('div', {
  name: 'MuiChatPlan',
  slot: 'Title',
  overridesResolver: (_, styles) => styles.title,
})(({ theme }) => ({
  ...theme.typography.overline,
  color: (theme.vars || theme).palette.text.secondary,
  marginBottom: theme.spacing(0.75),
}));

const ChatPlanList = styled('div', {
  name: 'MuiChatPlan',
  slot: 'List',
  overridesResolver: (_, styles) => styles.list,
})({
  display: 'flex',
  flexDirection: 'column',
});

const ChatPlan = React.forwardRef<HTMLDivElement, ChatPlanProps>(function ChatPlan(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatPlan' });
  const { steps, children, title, className, classes: classesProp, ...other } = props;
  const classes = useChatPlanUtilityClasses(classesProp);

  return (
    <ChatPlanRoot ref={ref} className={clsx(classes.root, className)} {...other}>
      {title != null && <ChatPlanTitle className={classes.title}>{title}</ChatPlanTitle>}
      <ChatPlanList className={classes.list}>
        {steps != null
          ? steps.map((step) => (
              <ChatTask key={step.id} status={step.status} detail={step.detail}>
                {step.label}
              </ChatTask>
            ))
          : children}
      </ChatPlanList>
    </ChatPlanRoot>
  );
});

ChatPlan.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Custom content. Ignored when `steps` is provided.
   */
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Ordered list of steps to render. When provided, `ChatTask` children are
   * generated automatically. Use `children` for the composable API instead.
   */
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      detail: PropTypes.string,
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['done', 'error', 'pending', 'running', 'skipped']).isRequired,
    }),
  ),
  /**
   * Optional heading displayed above the step list.
   */
  title: PropTypes.string,
} as any;

export { ChatPlan };
