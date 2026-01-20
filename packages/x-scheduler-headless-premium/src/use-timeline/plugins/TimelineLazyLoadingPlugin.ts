import { SchedulerLazyLoadingPlugin } from '@mui/x-scheduler-headless/utils';
import { TimelineState, TimelineParameters } from '../TimelineStore.types';

export class TimelineLazyLoadingPlugin<
  TEvent extends object,
  TResource extends object,
> extends SchedulerLazyLoadingPlugin<
  TEvent,
  TResource,
  TimelineState,
  TimelineParameters<TEvent, TResource>
> {}
