import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/utils';
import clsx from 'clsx';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridRowsLoadingSelector } from '../../hooks/features/rows/gridRowsSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getMinimalContentHeight } from '../../hooks/features/rows/gridRowsUtils';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';

interface GridOverlayWrapperRootOwnerState extends React.HTMLAttributes<HTMLDivElement> {
  placeOverContent: boolean;
}

const GridOverlayWrapperRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'OverlayWrapper',
  overridesResolver: (props, styles) => styles.overlayWrapper,
})<{ ownerState?: GridOverlayWrapperRootOwnerState }>(({ ownerState }) => ({
  position: 'sticky', // To stay in place while scrolling
  top: 0,
  left: 0,
  width: ownerState?.placeOverContent ? 0 : '100%', // width=0 to stay above the content instead of shifting it down
  height: ownerState?.placeOverContent ? 0 : '100%', // height=0 to stay above the content instead of shifting it down
  zIndex: ownerState?.placeOverContent ? 4 : 'unset', // z-index=5 to be above pinned columns, pinned rows and detail panel
}));

GridOverlayWrapperRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  ownerState: PropTypes.object,
} as any;

export { GridOverlayWrapperRoot };

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

function GridOverlayWrapper(props: React.PropsWithChildren<GridOverlayWrapperRootOwnerState>) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const { placeOverContent, ...rest } = props;

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
    height = getMinimalContentHeight(apiRef); // Give room to show the overlay when there no rows.
  }

  const classes = useUtilityClasses({ ...props, classes: rootProps.classes });

  if (!viewportInnerSize) {
    return null;
  }

  const ownerState = { placeOverContent };

  return (
    <GridOverlayWrapperRoot className={clsx(classes.root)} ownerState={ownerState}>
      <GridOverlayWrapperInner
        className={clsx(classes.inner)}
        style={{
          height,
          width: viewportInnerSize?.width ?? 0,
        }}
        {...rest}
      />
    </GridOverlayWrapperRoot>
  );
}

GridOverlayWrapper.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  placeOverContent: PropTypes.bool.isRequired,
} as any;

// TODO v6: Rename to GridLoadingOverlayRenderer because it only renders the loading overlay
export function GridOverlays() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const loading = useGridSelector(apiRef, gridRowsLoadingSelector);

  if (!loading) {
    return null;
  }

  const overlay = (
    <rootProps.components.LoadingOverlay {...rootProps.componentsProps?.loadingOverlay} />
  );

  if (overlay === null) {
    return null;
  }

  return <GridOverlayWrapper placeOverContent>{overlay}</GridOverlayWrapper>;
}
