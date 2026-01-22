import { SchedulerLazyLoadingPlugin } from '@mui/x-scheduler-headless/internals';
import { TimelinePremiumState, TimelinePremiumParameters } from '../TimelinePremiumStore.types';

export class TimelinePremiumLazyLoadingPlugin<
  TEvent extends object,
  TResource extends object,
> extends SchedulerLazyLoadingPlugin<
  TEvent,
  TResource,
  TimelinePremiumState,
  TimelinePremiumParameters<TEvent, TResource>
> {}
