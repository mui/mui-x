import type { GridCallbackDetails } from './api/gridCallbackDetails';
import type { GridEventLookup, GridControlledStateEventLookup } from './events';
import type { OutputSelector } from '../utils/createSelector';
import { GridApiCommunity } from './api/gridApiCommunity';

export interface GridControlStateItem<
  ApiRef extends React.RefObject<GridApiCommunity>,
  Args,
  E extends keyof GridControlledStateEventLookup,
> {
  stateId: string;
  propModel?: GridEventLookup[E]['params'];
  stateSelector:
    | OutputSelector<ApiRef, Args, GridControlledStateEventLookup[E]['params']>
    | ((apiRef: ApiRef) => GridControlledStateEventLookup[E]['params']);
  propOnChange?: (
    model: GridControlledStateEventLookup[E]['params'],
    details: GridCallbackDetails,
  ) => void;
  changeEvent: E;
}
