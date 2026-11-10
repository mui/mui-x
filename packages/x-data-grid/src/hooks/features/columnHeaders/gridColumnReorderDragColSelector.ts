import { createRootSelector } from '../../../utils/createSelector';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';

/**
 * The field of the column being reordered, or `undefined` when none is.
 * The `columnReorder` state is only initialized by the Pro package, so it's read defensively.
 * @ignore - do not document.
 */
export const gridColumnReorderDragColDefensiveSelector = createRootSelector(
  (state: GridStateCommunity) =>
    (state as GridStateCommunity & { columnReorder?: { dragCol: string } }).columnReorder?.dragCol,
);
