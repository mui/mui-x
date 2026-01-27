import { Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { EventCalendarStore } from '@mui/x-scheduler-headless/use-event-calendar';
import { EventCalendarPremiumLazyLoadingPlugin } from './plugins/EventCalendarPremiumLazyLoadingPlugin';
import { EventCalendarPremiumParameters } from './EventCalendarPremiumStore.types';

/**
 * Premium version of EventCalendarStore with lazy loading support.
 * Extends EventCalendarStore and adds the lazy loading plugin.
 */
export class EventCalendarPremiumStore<
  TEvent extends object,
  TResource extends object,
> extends EventCalendarStore<TEvent, TResource> {
  public constructor(
    parameters: EventCalendarPremiumParameters<TEvent, TResource>,
    adapter: Adapter,
  ) {
    super(parameters, adapter);

    // Initialize lazy loading plugin for premium features
    this.lazyLoading = new EventCalendarPremiumLazyLoadingPlugin<TEvent, TResource>(this);
  }
}
