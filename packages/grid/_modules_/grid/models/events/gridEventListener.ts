import { MuiBaseEvent, MuiEvent } from '../muiEvent';
import { GridCallbackDetails } from '../api/gridCallbackDetails';
import { GridEventsStr } from './gridEvents';
import { GridEventLookup } from './gridEventLookup';

export type GridEventListener<E extends GridEventsStr> = (
  params: GridEventLookup[E] extends { params: any } ? GridEventLookup[E]['params'] : undefined,
  event: GridEventLookup[E] extends { event: MuiBaseEvent }
    ? MuiEvent<GridEventLookup[E]['event']>
    : MuiEvent<{}>,
  details: GridCallbackDetails,
) => void;
