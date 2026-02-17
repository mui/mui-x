import { SchedulerStore } from '../utils/SchedulerStore';

export interface SchedulerAnyStore extends SchedulerStore<any, any, any, any> {}

export type SchedulerPublicAPI<TStore extends SchedulerAnyStore> = ReturnType<
  TStore['buildPublicAPI']
>;
