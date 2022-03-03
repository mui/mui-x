import { MuiBaseEvent } from '../muiEvent';
import { GridEventLookup } from './gridEventLookup';
import { GridEventsStr } from './gridEvents';

type PublisherArgsNoEvent<E extends GridEventsStr, T extends { params: any }> = [E, T['params']];

type PublisherArgsRequiredEvent<
  E extends GridEventsStr,
  T extends { params: any; event: MuiBaseEvent },
> = [E, T['params'], T['event']];

type PublisherArgsOptionalEvent<
  E extends GridEventsStr,
  T extends { params: any; event: MuiBaseEvent },
> = PublisherArgsRequiredEvent<E, T> | PublisherArgsNoEvent<E, T>;

type PublisherArgsEvent<
  E extends GridEventsStr,
  T extends { params: any; event: MuiBaseEvent },
> = {} extends T['event'] ? PublisherArgsOptionalEvent<E, T> : PublisherArgsRequiredEvent<E, T>;

type PublisherArgsParams<E extends GridEventsStr, T extends { params: any }> = [E, T['params']];

type PublisherArgsNoParams<E extends GridEventsStr> = [E];

type GridEventPublisherArg<E extends GridEventsStr, T> = T extends {
  params: any;
  event: MuiBaseEvent;
}
  ? PublisherArgsEvent<E, T>
  : T extends { params: any }
  ? PublisherArgsParams<E, T>
  : PublisherArgsNoParams<E>;

export type GridEventPublisher = <E extends GridEventsStr>(
  ...params: GridEventPublisherArg<E, GridEventLookup[E]>
) => void;
