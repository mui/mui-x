import { MuiEvent } from './muiEvent';
import { GridCallbackDetails } from './api/gridCallbackDetails';

export type GridEventListener<Params, Event extends MuiEvent> = (
  params: Params,
  event: Event,
  details: GridCallbackDetails,
) => void;
