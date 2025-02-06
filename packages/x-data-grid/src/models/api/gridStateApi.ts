import { RefObject } from '@mui/x-internals/types';
import { GridStateCommunity } from '../gridStateCommunity';
import { GridControlledStateEventLookup, GridControlledStateReasonLookup } from '../events';
import { GridControlStateItem } from '../controlStateItem';
import { GridApiCommunity } from './gridApiCommunity';

export interface GridStateApi<State extends GridStateCommunity> {
  /**
   * Property that contains the whole state of the grid.
   */
  state: State;
  /**
   * Forces the grid to rerender. It's often used after a state update.
   * @deprecated no longer needed.
   */
  forceUpdate: () => void;
  /**
   * Sets the whole state of the grid.
   * @param {GridState | (oldState: GridState) => GridState} state The new state or the callback creating the new state.
   * @param {string} reason The reason for this change to happen.
   * @returns {boolean} Has the state been updated.
   * @ignore - do not document.
   */
  setState: <S extends State, K extends keyof GridControlledStateReasonLookup>(
    state: S | ((previousState: S) => S),
    reason?: GridControlledStateReasonLookup[K],
  ) => boolean;
}

export interface GridStatePrivateApi<ApiRef extends RefObject<GridApiCommunity>> {
  /**
   * Updates a single sub-state.
   * Publishes the `xxxChange` event and calls the `onXXXChange` prop.
   * @param {K} key Which key of the state to update.
   * @param {(oldState: GridState) => GridState} state The new state of the sub-state to update.
   * @param {GridControlledStateReasonLookup[K]} reason The reason to pass to the callback prop and event.
   * @returns {boolean} `true` if the state has been successfully updated.
   */
  updateControlState: <K extends keyof GridControlledStateReasonLookup>(
    key: K,
    state: (oldState: ApiRef['current']['state'][K]) => ApiRef['current']['state'][K],
    reason?: GridControlledStateReasonLookup[K],
  ) => boolean;
  /**
   * Updates a control state that binds the model, the onChange prop, and the grid state together.
   * @param {GridControlStateItem>} controlState The [[GridControlStateItem]] to be registered.
   */
  registerControlState: <E extends keyof GridControlledStateEventLookup, Args>(
    controlState: GridControlStateItem<ApiRef, Args, E>,
  ) => void;
}
