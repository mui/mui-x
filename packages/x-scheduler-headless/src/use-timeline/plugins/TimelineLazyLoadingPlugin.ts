import { SchedulerLazyLoadingPlugin } from '../../utils/SchedulerStore/plugins/SchedulerLazyLoadingPlugin';
import { TimelineStore } from '../TimelineStore';
import { TimelineState, TimelineParameters } from '../TimelineStore.types';

export class TimelineLazyLoadingPlugin<
  TEvent extends object,
  TResource extends object,
> extends SchedulerLazyLoadingPlugin<
  TEvent,
  TResource,
  TimelineState,
  TimelineParameters<TEvent, TResource>
> {
  constructor(store: TimelineStore<TEvent, TResource>) {
    super(store);
    // TODO: Register store effect to fetch data when the visible range changes
  }
}
