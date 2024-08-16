import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { styled } from '../../utils/styled';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridDimensionsSelector } from '../../hooks/features/dimensions';
import { GridOverlayType } from '../../hooks/features/overlays/useGridOverlays';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridVisibleRows } from '../../hooks/utils/useGridVisibleRows';
import { getMinimalContentHeight } from '../../hooks/features/rows/gridRowsUtils';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { GridLoadingOverlayVariant } from '../GridLoadingOverlay';

interface GridOverlaysProps {
  overlayType: GridOverlayType;
  loadingOverlayVariant: GridLoadingOverlayVariant | null;
}

const GridOverlayWrapperRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'OverlayWrapper',
  shouldForwardProp: (prop) => prop !== 'overlayType' && prop !== 'loadingOverlayVariant',
  overridesResolver: (props, styles) => styles.overlayWrapper,
})<GridOverlaysProps>(({ overlayType, loadingOverlayVariant }) =>
  // Skeleton overlay should flow with the scroll container and not be sticky
  loadingOverlayVariant !== 'skeleton'
    ? {
        position: 'sticky', // To stay in place while scrolling
        top: 'var(--DataGrid-headersTotalHeight)',
        left: 0,
        width: 0, // To stay above the content instead of shifting it down
        height: 0, // To stay above the content instead of shifting it down
        zIndex:
          overlayType === 'loadingOverlay'
            ? 5 // Should be above pinned columns, pinned rows, and detail panel
            : 4, // Should be above pinned columns and detail panel
      }
    : {},
);

const GridOverlayWrapperInner = styled('div', {
  name: 'MuiDataGrid',
  slot: 'OverlayWrapperInner',
  shouldForwardProp: (prop) => prop !== 'overlayType' && prop !== 'loadingOverlayVariant',
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

function GridOverlayWrapper(props: React.PropsWithChildren<GridOverlaysProps>) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const currentPage = useGridVisibleRows(apiRef, rootProps);
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);

  let height: React.CSSProperties['height'] =
    dimensions.viewportOuterSize.height -
    dimensions.topContainerHeight -
    dimensions.bottomContainerHeight -
    (dimensions.hasScrollX ? dimensions.scrollbarSize : 0);

  if ((rootProps.autoHeight && currentPage.rows.length === 0) || height === 0) {
    height = getMinimalContentHeight(apiRef);
  }

  const classes = useUtilityClasses({ ...props, classes: rootProps.classes });

  return (
    <GridOverlayWrapperRoot className={clsx(classes.root)} {...props}>
      <GridOverlayWrapperInner
        className={clsx(classes.inner)}
        style={{
          height,
          width: dimensions.viewportOuterSize.width,
        }}
        {...props}
      />
    </GridOverlayWrapperRoot>
  );
}

GridOverlays.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  loadingOverlayVariant: PropTypes.oneOf(['circular-progress', 'linear-progress', 'skeleton']),
  overlayType: PropTypes.oneOf(['loadingOverlay', 'noResultsOverlay', 'noRowsOverlay']),
} as any;

export function GridOverlays(props: GridOverlaysProps) {
  const { overlayType } = props;
  const rootProps = useGridRootProps();

  if (!overlayType) {
    return null;
  }

  const Overlay = rootProps.slots?.[overlayType];
  const overlayProps = rootProps.slotProps?.[overlayType];

  return (
    <GridOverlayWrapper {...props}>
      <Overlay {...overlayProps} />
    </GridOverlayWrapper>
  );
}
