import * as React from 'react';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridVisibleRowCountSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridRowCountSelector } from '../../hooks/features/rows/gridRowsSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridOverlayWrapper } from './GridOverlayWrapper';

export function GridOverlays() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleRowCount = useGridSelector(apiRef, gridVisibleRowCountSelector);

  const showNoRowsOverlay = !rootProps.loading && totalRowCount === 0;
  const showNoResultsOverlay = !rootProps.loading && totalRowCount > 0 && visibleRowCount === 0;

  let overlay: JSX.Element | null = null;

  if (showNoRowsOverlay) {
    overlay = <rootProps.components.NoRowsOverlay {...rootProps.componentsProps?.noRowsOverlay} />;
  }

  if (showNoResultsOverlay) {
    overlay = (
      <rootProps.components.NoResultsOverlay {...rootProps.componentsProps?.noResultsOverlay} />
    );
  }

  if (rootProps.loading) {
    overlay = (
      <rootProps.components.LoadingOverlay {...rootProps.componentsProps?.loadingOverlay} />
    );
  }

  return <GridOverlayWrapper>{overlay}</GridOverlayWrapper>;
}
