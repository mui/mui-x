import { useGridSelector } from '../../utils';
import { useGridApiContext } from '../../utils/useGridApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { gridExpandedRowCountSelector } from '../filter';
import { gridRowCountSelector, gridRowsLoadingSelector } from '../rows';
import { GridLoadingOverlayVariant } from '../../../components/GridLoadingOverlay';
import { GridSlotsComponent } from '../../../models/gridSlotsComponent';

export type GridOverlayType =
  | keyof Pick<GridSlotsComponent, 'noRowsOverlay' | 'noResultsOverlay' | 'loadingOverlay'>
  | null;

/**
 * Uses the grid state to determine which overlay to display.
 * Returns the active overlay type and the active loading overlay variant.
 */
export const useGridOverlays = () => {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleRowCount = useGridSelector(apiRef, gridExpandedRowCountSelector);
  const noRows = totalRowCount === 0;
  const loading = useGridSelector(apiRef, gridRowsLoadingSelector);

  const showNoRowsOverlay = !loading && noRows;
  const showNoResultsOverlay = !loading && totalRowCount > 0 && visibleRowCount === 0;

  let overlayType: GridOverlayType = null;
  let loadingOverlayVariant: GridLoadingOverlayVariant | null = null;

  if (showNoRowsOverlay) {
    overlayType = 'noRowsOverlay';
  }

  if (showNoResultsOverlay) {
    overlayType = 'noResultsOverlay';
  }

  if (loading) {
    overlayType = 'loadingOverlay';
    loadingOverlayVariant =
      rootProps.slotProps?.loadingOverlay?.[noRows ? 'noRowsVariant' : 'variant'] || null;
  }

  return { overlayType, loadingOverlayVariant };
};
