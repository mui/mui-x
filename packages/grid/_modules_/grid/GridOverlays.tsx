import * as React from 'react';
import { GridApiContext } from './components/GridApiContext';
import { GridRootPropsContext } from './context/GridRootPropsContext';
import { useGridSelector } from './hooks/features/core/useGridSelector';
import { visibleGridRowCountSelector } from './hooks/features/filter/gridFilterSelector';
import { gridRowCountSelector } from './hooks/features/rows/gridRowsSelector';

export function GridOverlays() {
  const apiRef = React.useContext(GridApiContext)!;
  const props = React.useContext(GridRootPropsContext)!;

  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);

  const showNoRowsOverlay = !props.loading && totalRowCount === 0;
  const showNoResultsOverlay = !props.loading && totalRowCount > 0 && visibleRowCount === 0;

  return (
    <React.Fragment>
      {showNoRowsOverlay && (
        <apiRef.current.components.NoRowsOverlay {...props.componentsProps?.noRowsOverlay} />
      )}
      {showNoResultsOverlay && (
        <apiRef.current.components.NoResultsOverlay {...props.componentsProps?.noResultsOverlay} />
      )}
      {props.loading && (
        <apiRef.current.components.LoadingOverlay {...props.componentsProps?.loadingOverlay} />
      )}
    </React.Fragment>
  );
}
