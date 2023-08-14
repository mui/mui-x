import * as React from 'react';
import { styled } from '@mui/system';
import {
  unstable_composeClasses as composeClasses,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/utils';
import clsx from 'clsx';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridExpandedRowCountSelector } from '../../hooks/features/filter/gridFilterSelector';
import {
  gridRowCountSelector,
  gridRowsLoadingSelector,
} from '../../hooks/features/rows/gridRowsSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getMinimalContentHeight } from '../../hooks/features/rows/gridRowsUtils';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';

const GridOverlayWrapperRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'OverlayWrapper',
  overridesResolver: (props, styles) => styles.overlayWrapper,
})({
  position: 'sticky', // To stay in place while scrolling
  top: 0,
  left: 0,
  width: 0, // To stay above the content instead of shifting it down
  height: 0, // To stay above the content instead of shifting it down
  zIndex: 4, // Should be above pinned columns, pinned rows and detail panel
});

const GridOverlayWrapperInner = styled('div', {
  name: 'MuiDataGrid',
  slot: 'OverlayWrapperInner',
  overridesResolver: (props, styles) => styles.overlayWrapperInner,
})({});

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['overlayWrapper'],
    inner: ['overlayWrapperInner'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridOverlayWrapper(props: React.PropsWithChildren<{}>) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const [viewportInnerSize, setViewportInnerSize] = React.useState(
    () => apiRef.current.getRootDimensions()?.viewportInnerSize ?? null,
  );

  const handleViewportSizeChange = React.useCallback(() => {
    setViewportInnerSize(apiRef.current.getRootDimensions()?.viewportInnerSize ?? null);
  }, [apiRef]);

  useEnhancedEffect(() => {
    return apiRef.current.subscribeEvent('viewportInnerSizeChange', handleViewportSizeChange);
  }, [apiRef, handleViewportSizeChange]);

  let height: React.CSSProperties['height'] = viewportInnerSize?.height ?? 0;
  if (rootProps.autoHeight && height === 0) {
    height = getMinimalContentHeight(apiRef, rootProps.rowHeight); // Give room to show the overlay when there no rows.
  }

  const classes = useUtilityClasses({ ...props, classes: rootProps.classes });

  if (!viewportInnerSize) {
    return null;
  }

  return (
    <GridOverlayWrapperRoot className={clsx(classes.root)}>
      <GridOverlayWrapperInner
        className={clsx(classes.inner)}
        style={{
          height,
          width: viewportInnerSize?.width ?? 0,
        }}
        {...props}
      />
    </GridOverlayWrapperRoot>
  );
}

export function GridOverlays() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleRowCount = useGridSelector(apiRef, gridExpandedRowCountSelector);
  const loading = useGridSelector(apiRef, gridRowsLoadingSelector);

  const showNoRowsOverlay = !loading && totalRowCount === 0;
  const showNoResultsOverlay = !loading && totalRowCount > 0 && visibleRowCount === 0;

  let overlay: React.JSX.Element | null = null;

  if (showNoRowsOverlay) {
    overlay = <rootProps.slots.noRowsOverlay {...rootProps.slotProps?.noRowsOverlay} />;
  }

  if (showNoResultsOverlay) {
    overlay = <rootProps.slots.noResultsOverlay {...rootProps.slotProps?.noResultsOverlay} />;
  }

  if (loading) {
    overlay = <rootProps.slots.loadingOverlay {...rootProps.slotProps?.loadingOverlay} />;
  }

  if (overlay === null) {
    return null;
  }

  return <GridOverlayWrapper>{overlay}</GridOverlayWrapper>;
}
