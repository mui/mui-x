import { SchedulerLazyLoadingPlugin } from '@mui/x-scheduler-headless/internals';
import {
  EventTimelinePremiumState,
  EventTimelinePremiumParameters,
} from '../EventTimelinePremiumStore.types';

export class EventTimelinePremiumLazyLoadingPlugin<
  TEvent extends object,
  TResource extends object,
> extends SchedulerLazyLoadingPlugin<
  TEvent,
  TResource,
  EventTimelinePremiumState,
  EventTimelinePremiumParameters<TEvent, TResource>
> {}
