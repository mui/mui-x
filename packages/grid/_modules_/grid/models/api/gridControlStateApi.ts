import { GridState } from '../gridState';
import { GridControlStateItem } from '../controlStateItem';

/**
 * The control state API interface that is available in the grid `apiRef`.
 */
export interface GridControlStateApi {
  /**
   * Updates a control state that binds the model, the onChange prop, and the grid state together.
   * @param {GridControlStateItem<TModel>} controlState The [[GridControlStateItem]] to be registered.
   * @ignore - do not document.
   */
  unstable_updateControlState: <TModel>(controlState: GridControlStateItem<TModel>) => void;
  /**
   * Allows the internal grid state to apply the registered control state constraint.
   * @param {GridState} state The new modified state that would be the next if the state is not controlled.
   * @returns {{ ignoreSetState: boolean, postUpdate: () => void }} ignoreSetState let the state know if it should update, and postUpdate is a callback function triggered if the state has updated.
   * @ignore - do not document.
   */
  unstable_applyControlStateConstraint: (state: GridState) => {
    ignoreSetState: boolean;
    postUpdate: () => void;
  };
}
