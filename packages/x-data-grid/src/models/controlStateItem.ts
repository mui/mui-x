import { RefObject } from '@mui/x-internals/types';
import type { GridCallbackDetails } from './api/gridCallbackDetails';
import type { GridEventLookup, GridControlledStateEventLookup } from './events';
import type { OutputSelector } from '../utils/createSelector';
import type { GridStateCommunity } from './gridStateCommunity';

export interface GridControlStateItem<
  State extends GridStateCommunity,
  Args,
  E extends keyof GridControlledStateEventLookup,
> {
  stateId: string;
  propModel?: GridEventLookup[E]['params'];
  stateSelector:
    | OutputSelector<State, Args, GridControlledStateEventLookup[E]['params']>
    | ((apiRef: RefObject<{ state: State }>) => GridControlledStateEventLookup[E]['params']);
  propOnChange?: (
    model: GridControlledStateEventLookup[E]['params'],
    details: GridCallbackDetails,
  ) => void;
  changeEvent: E;
}
