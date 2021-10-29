import { GridState } from './gridState';
import { GridCallbackDetails } from './api/gridCallbackDetails';
import type { GridEventLookup, GridEventsWithFullTyping } from './api';

export interface GridControlStateItem<E extends GridEventsWithFullTyping> {
  stateId: string;
  propModel?: GridEventLookup[E]['params'];
  stateSelector: (state: GridState) => GridEventLookup[E]['params'];
  propOnChange?: (model: GridEventLookup[E]['params'], details: GridCallbackDetails) => void;
  changeEvent: E;
}
