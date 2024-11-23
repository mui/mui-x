import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { Theme, SxProps, styled } from '@mui/system';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { minimalContentHeight } from '../../hooks/features/rows/gridRowsUtils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridDimensionsSelector } from '../../hooks/features/dimensions';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridSlotsComponent } from '../../models';

export type GridOverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  sx?: SxProps<Theme>;
};

type GridLoadingOverlayVariant = 'circular-progress' | 'linear-progress' | 'skeleton';

type GridOverlayType =
  | keyof Pick<GridSlotsComponent, 'noRowsOverlay' | 'noResultsOverlay' | 'loadingOverlay'>
  | null;

interface GridOverlaysProps {
  overlayType: GridOverlayType;
  loadingOverlayVariant: GridLoadingOverlayVariant | null;
}

interface GridOverlayWrapperRootProps extends GridOverlaysProps {
  right: number;
}
const GridOverlayWrapperRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'OverlayWrapper',
  shouldForwardProp: (prop) =>
    prop !== 'overlayType' && prop !== 'loadingOverlayVariant' && prop !== 'right',
  overridesResolver: (props, styles) => styles.overlayWrapper,
})<GridOverlayWrapperRootProps>(({ overlayType, loadingOverlayVariant, right }) =>
  // Skeleton overlay should flow with the scroll container and not be sticky
  loadingOverlayVariant !== 'skeleton'
    ? {
        position: 'sticky', // To stay in place while scrolling
        top: 'var(--DataGrid-headersTotalHeight)', // TODO: take pinned rows into account
        left: 0,
        right: `${right}px`,
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
type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['overlay'],
    wrapperRoot: ['overlayWrapper'],
    wrapperInner: ['overlayWrapperInner'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridOverlayRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Overlay',
  overridesResolver: (_, styles) => styles.overlay,
})<{ ownerState: OwnerState }>({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--unstable_DataGrid-overlayBackground)',
});

function GridOverlayWrapper(props: React.PropsWithChildren<GridOverlaysProps>) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);

  let height: React.CSSProperties['height'] = Math.max(
    dimensions.viewportOuterSize.height -
      dimensions.topContainerHeight -
      dimensions.bottomContainerHeight -
      (dimensions.hasScrollX ? dimensions.scrollbarSize : 0),
    0,
  );

  if (height === 0) {
    height = minimalContentHeight;
  }

  const classes = useUtilityClasses(rootProps);

  return (
    <GridOverlayWrapperRoot
      className={clsx(classes.wrapperRoot)}
      {...props}
      right={dimensions.columnsTotalWidth - dimensions.viewportOuterSize.width}
    >
      <GridOverlayWrapperInner
        className={clsx(classes.wrapperInner)}
        style={{
          height,
          width: dimensions.viewportOuterSize.width,
        }}
        {...props}
      />
    </GridOverlayWrapperRoot>
  );
}
const GridOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(function GridOverlay(
  props: GridOverlayProps,
  ref,
) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  return (
    <GridOverlayRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={rootProps}
      {...other}
    />
  );
});

GridOverlay.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

GridOverlayWrapper.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  loadingOverlayVariant: PropTypes.oneOf(['circular-progress', 'linear-progress', 'skeleton']),
  overlayType: PropTypes.oneOf(['loadingOverlay', 'noResultsOverlay', 'noRowsOverlay']),
} as any;

export { GridOverlay, GridOverlayWrapper };
