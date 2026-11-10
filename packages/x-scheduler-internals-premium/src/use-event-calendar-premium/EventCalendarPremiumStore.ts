import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import { ExtendableEventCalendarStore } from '@mui/x-scheduler-internals/use-event-calendar';
import { EventCalendarPremiumLazyLoadingPlugin } from './plugins/EventCalendarPremiumLazyLoadingPlugin';
import type { EventCalendarPremiumStoreParameters } from './EventCalendarPremiumStore.types';

/**
 * Premium version of EventCalendarStore with premium plugins.
 */
export class EventCalendarPremiumStore<
  TEvent extends object,
  TResource extends object,
> extends ExtendableEventCalendarStore<
  TEvent,
  TResource,
  EventCalendarPremiumStoreParameters<TEvent, TResource>
> {
  declare public lazyLoading: EventCalendarPremiumLazyLoadingPlugin<TEvent>;

  public constructor(
    parameters: EventCalendarPremiumStoreParameters<TEvent, TResource>,
    adapter: Adapter,
  ) {
    super(
      parameters,
      adapter,
      'EventCalendarPremiumStore',
      parameters.storeFeatures?.recurringEvents ?? null,
    );

    this.lazyLoading = this.disposables.use(
      new EventCalendarPremiumLazyLoadingPlugin<TEvent>(this),
    );
  }

  public buildPublicAPI() {
    return {
      ...super.buildPublicAPI(),
    };
  }
}
