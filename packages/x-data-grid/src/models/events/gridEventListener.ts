import type { MuiBaseEvent, MuiEvent } from '@mui/x-internals/types';
import type { GridCallbackDetails } from '../api/gridCallbackDetails';
import type { GridApiCommon } from '../api/gridApiCommon';
import type { GridEventLookup, GridEvents } from './gridEventLookup';

export type GridEventListener<E extends GridEvents, Api extends GridApiCommon = GridApiCommon> = (
  params: GridEventLookup[E] extends { params: any } ? GridEventLookup[E]['params'] : undefined,
  event: GridEventLookup[E] extends { event: MuiBaseEvent }
    ? MuiEvent<GridEventLookup[E]['event']>
    : MuiEvent<{}>,
  details: GridCallbackDetails<any, Api>,
) => void;
