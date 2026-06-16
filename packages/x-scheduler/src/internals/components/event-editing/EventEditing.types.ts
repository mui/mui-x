import * as React from 'react';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';

export interface EventEditingTriggerProps extends React.HTMLAttributes<HTMLElement> {
  occurrence: SchedulerRenderableEventOccurrence;
  children: React.ReactNode;
}

export interface CompactEventEditingProviderProps {
  children: React.ReactNode;
}
