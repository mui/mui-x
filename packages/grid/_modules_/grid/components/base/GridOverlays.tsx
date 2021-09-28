import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridVisibleTopLevelRowCountSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridRowCountSelector } from '../../hooks/features/rows/gridRowsSelector';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export function GridOverlays() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleTopLevelRowCount = useGridSelector(apiRef, gridVisibleTopLevelRowCountSelector);

  const showNoRowsOverlay = !rootProps.loading && totalRowCount === 0;
  const showNoResultsOverlay =
    !rootProps.loading && totalRowCount > 0 && visibleTopLevelRowCount === 0;

  if (showNoRowsOverlay) {
    return <rootProps.components.NoRowsOverlay {...rootProps.componentsProps?.noRowsOverlay} />;
  }

  if (showNoResultsOverlay) {
    return (
      <rootProps.components.NoResultsOverlay {...rootProps.componentsProps?.noResultsOverlay} />
    );
  }

  if (rootProps.loading) {
    return <rootProps.components.LoadingOverlay {...rootProps.componentsProps?.loadingOverlay} />;
  }
  return null;
}
