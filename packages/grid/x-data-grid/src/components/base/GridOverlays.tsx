import * as React from 'react';
import PropTypes from 'prop-types';
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
import styled from '../../utils/styled';

const GridOverlayWrapperRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'OverlayWrapper',
  shouldForwardProp: (prop) => prop !== 'overlayType',
  overridesResolver: (props, styles) => styles.overlayWrapper,
})<{ overlayType: 'loadingOverlay' | string }>(({ overlayType }) => ({
  position: 'sticky', // To stay in place while scrolling
  top: 0,
  left: 0,
  width: 0, // To stay above the content instead of shifting it down
  height: 0, // To stay above the content instead of shifting it down
  zIndex:
    overlayType === 'loadingOverlay'
      ? 5 // Should be above pinned columns, pinned rows, and detail panel
      : 4, // Should be above pinned columns and detail panel
}));

const GridOverlayWrapperInner = styled('div', {
  name: 'MuiDataGrid',
  slot: 'OverlayWrapperInner',
  shouldForwardProp: (prop) => prop !== 'overlayType',
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

function GridOverlayWrapper(props: React.PropsWithChildren<{ overlayType: string }>) {
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
    <GridOverlayWrapperRoot className={clsx(classes.root)} overlayType={props.overlayType}>
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

GridOverlayWrapper.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  overlayType: PropTypes.string.isRequired,
} as any;

export function GridOverlays() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleRowCount = useGridSelector(apiRef, gridExpandedRowCountSelector);
  const loading = useGridSelector(apiRef, gridRowsLoadingSelector);

  const showNoRowsOverlay = !loading && totalRowCount === 0;
  const showNoResultsOverlay = !loading && totalRowCount > 0 && visibleRowCount === 0;

  let overlay: React.JSX.Element | null = null;
  let overlayType = '';

  if (showNoRowsOverlay) {
    overlay = <rootProps.slots.noRowsOverlay {...rootProps.slotProps?.noRowsOverlay} />;
    overlayType = 'noRowsOverlay';
  }

  if (showNoResultsOverlay) {
    overlay = <rootProps.slots.noResultsOverlay {...rootProps.slotProps?.noResultsOverlay} />;
    overlayType = 'noResultsOverlay';
  }

  if (loading) {
    overlay = <rootProps.slots.loadingOverlay {...rootProps.slotProps?.loadingOverlay} />;
    overlayType = 'loadingOverlay';
  }

  if (overlay === null) {
    return null;
  }

  return <GridOverlayWrapper overlayType={overlayType}>{overlay}</GridOverlayWrapper>;
}
