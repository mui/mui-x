import { GridState } from '../../hooks/features/core/gridState';
import { ControlStateItem } from '../controlStateItem';

/**
 * The control state API interface that is available in the grid `apiRef`.
 */
export interface GridControlStateApi {
  /**
   * Updates a control state that binds the model, the onChange prop, and the grid state together.
   * @param {ControlStateItem<TModel>} controlState The [[ControlStateItem]] to be registered.
   * @ignore - do not document.
   */
  updateControlState: <TModel>(controlState: ControlStateItem<TModel>) => void;
  /**
   * Allows the internal grid state to apply the registered control state constraint.
   * @param {GridState} state The new modified state that would be the next if the state is not controlled.
   * @returns {shouldUpdate: boolean, postUpdate: () => void}, shouldUpdate let the state know if it should update, and postUpdate is a callback function triggered if the state has updated.
   * @ignore - do not document.
   */
  applyControlStateConstraint: (state: GridState) => {
    shouldUpdate: boolean;
    postUpdate: () => void;
  };
}
