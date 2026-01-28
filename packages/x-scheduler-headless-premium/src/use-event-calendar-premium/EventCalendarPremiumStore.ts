import { Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { ExtendableEventCalendarStore } from '@mui/x-scheduler-headless/use-event-calendar';
import { EventCalendarPremiumLazyLoadingPlugin } from './plugins/EventCalendarPremiumLazyLoadingPlugin';
import { EventCalendarPremiumParameters } from './EventCalendarPremiumStore.types';

/**
 * Premium version of EventCalendarStore with premium plugins.
 */
export class EventCalendarPremiumStore<
  TEvent extends object,
  TResource extends object,
> extends ExtendableEventCalendarStore<TEvent, TResource> {
  public lazyLoading: EventCalendarPremiumLazyLoadingPlugin<TEvent>;

  public constructor(
    parameters: EventCalendarPremiumParameters<TEvent, TResource>,
    adapter: Adapter,
  ) {
    super(parameters, adapter, 'EventCalendarPremiumStore');

    this.lazyLoading = new EventCalendarPremiumLazyLoadingPlugin<TEvent>(this);
  }
}
