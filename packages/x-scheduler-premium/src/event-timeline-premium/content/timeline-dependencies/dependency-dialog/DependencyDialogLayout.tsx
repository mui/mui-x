'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import type {
  SchedulerDependency,
  SchedulerDependencyEditor,
} from '@mui/x-scheduler-internals-premium/models';
import { getPaletteVariants } from '@mui/x-scheduler/internals';
import { DEPENDENCY_DIALOG_TEXT } from './dependencyDialogUtils';

export const DependencyDialogBody = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogBody',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(0, 3, 3),
}));

export const DependencyDialogDetails = styled('dl', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogDetails',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(60px, auto) 1fr',
  columnGap: theme.spacing(1),
  rowGap: theme.spacing(1.5),
  margin: 0,
  color: (theme.vars || theme).palette.text.primary,
  '& dd': {
    margin: 0,
    // Lets a long event title shrink to an ellipsis.
    minWidth: 0,
  },
}));

const DependencyDialogEventChip = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'DependencyDialogEventChip',
})(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  maxWidth: '100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  verticalAlign: 'middle',
  padding: theme.spacing(0.25, 1, 0.25, 1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-surface-subtle)',
  color: 'var(--event-on-surface-subtle-primary)',
  ...theme.typography.body2,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 3,
    background: 'var(--event-surface-accent)',
  },
  variants: getPaletteVariants(theme),
}));

export interface DependencyDialogContentProps extends Pick<
  SchedulerDependencyEditor,
  'sourceResourceId' | 'targetResourceId'
> {
  dependency: SchedulerDependency;
  titleId: string;
  dragHandlerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

function DependencyDialogEvent(props: {
  eventId: SchedulerDependency['source'];
  resourceId: SchedulerDependencyEditor['sourceResourceId'];
}) {
  const { eventId, resourceId } = props;
  const store = useEventTimelinePremiumStoreContext();
  const title = useStore(
    store,
    (state) => schedulerEventSelectors.processedEvent(state, eventId)?.title ?? '',
  );
  const color = useStore(store, schedulerEventSelectors.color, eventId, resourceId);

  return (
    <Typography component="dd">
      <DependencyDialogEventChip data-palette={color} title={title}>
        {title}
      </DependencyDialogEventChip>
    </Typography>
  );
}

/**
 * The From and To rows of the dependency details.
 */
export function DependencyDialogEndpoints(
  props: Pick<DependencyDialogContentProps, 'dependency' | 'sourceResourceId' | 'targetResourceId'>,
) {
  const { dependency, sourceResourceId, targetResourceId } = props;

  return (
    <React.Fragment>
      <Typography component="dt">{DEPENDENCY_DIALOG_TEXT.sourceLabel}</Typography>
      <DependencyDialogEvent eventId={dependency.source} resourceId={sourceResourceId} />
      <Typography component="dt">{DEPENDENCY_DIALOG_TEXT.targetLabel}</Typography>
      <DependencyDialogEvent eventId={dependency.target} resourceId={targetResourceId} />
    </React.Fragment>
  );
}
