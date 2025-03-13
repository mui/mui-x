import * as React from 'react';
import { useGridSelector } from '../../utils';
import { useGridApiContext } from '../../utils/useGridApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { gridExpandedRowCountSelector } from '../filter';
import { gridRowCountSelector, gridRowsLoadingSelector } from '../rows';
import { gridPinnedRowsCountSelector } from '../rows/gridRowsSelector';
import { GridLoadingOverlayVariant } from '../../../components/GridLoadingOverlay';
import { GridOverlayWrapper } from '../../../components/base/GridOverlays';
import type { GridOverlayType } from '../../../components/base/GridOverlays';
import { gridVisibleColumnDefinitionsSelector } from '..';
import { gridPivotEnabledSelector } from '../pivoting';

/**
 * Uses the grid state to determine which overlay to display.
 * Returns the active overlay type and the active loading overlay variant.
 */
export const useGridOverlays = () => {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleRowCount = useGridSelector(apiRef, gridExpandedRowCountSelector);
  const pinnedRowsCount = useGridSelector(apiRef, gridPinnedRowsCountSelector);
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const noRows = totalRowCount === 0 && pinnedRowsCount === 0;
  const loading = useGridSelector(apiRef, gridRowsLoadingSelector);
  const pivotEnabled = useGridSelector(apiRef, gridPivotEnabledSelector);

  const showNoRowsOverlay = !loading && noRows;
  const showNoResultsOverlay = !loading && totalRowCount > 0 && visibleRowCount === 0;
  const showNoColumnsOverlay = !loading && visibleColumns.length === 0;
  const showEmptyPivotOverlay = showNoRowsOverlay && pivotEnabled;

  let overlayType: GridOverlayType | 'emptyPivotOverlay' = null;
  let loadingOverlayVariant: GridLoadingOverlayVariant | null = null;

  if (showNoRowsOverlay) {
    overlayType = 'noRowsOverlay';
  }

  if (showNoColumnsOverlay) {
    overlayType = 'noColumnsOverlay';
  }

  if (showEmptyPivotOverlay) {
    overlayType = 'emptyPivotOverlay';
  }

  if (showNoResultsOverlay) {
    overlayType = 'noResultsOverlay';
  }

  if (loading) {
    overlayType = 'loadingOverlay';
    loadingOverlayVariant =
      rootProps.slotProps?.loadingOverlay?.[noRows ? 'noRowsVariant' : 'variant'] ??
      (noRows ? 'skeleton' : 'linear-progress');
  }

  const overlaysProps = {
    overlayType: overlayType as NonNullable<GridOverlayType>,
    loadingOverlayVariant,
  };

  const getOverlay = () => {
    if (!overlayType) {
      return null;
    }
    const Overlay = rootProps.slots?.[overlayType as NonNullable<GridOverlayType>];
    const overlayProps = rootProps.slotProps?.[overlayType as NonNullable<GridOverlayType>];
    return (
      <GridOverlayWrapper {...overlaysProps}>
        <Overlay {...overlayProps} />
      </GridOverlayWrapper>
    );
  };

  return { getOverlay, overlaysProps };
};
