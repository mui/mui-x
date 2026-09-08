import type { SchedulerDataSource } from '@mui/x-scheduler-internals/internals';

/**
 * Parameters to enable lazy loading through a data source.
 */
export interface SchedulerLazyLoadingParameters<TEvent extends object> {
  /**
   * Data source for fetching events asynchronously.
   * When provided, events are fetched through the data source instead of the `events` prop.
   */
  dataSource?: SchedulerDataSource<TEvent>;
}
