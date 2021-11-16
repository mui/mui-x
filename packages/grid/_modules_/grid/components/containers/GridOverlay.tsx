import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';
import { useGridApiEventHandler } from '../../hooks/utils/useGridApiEventHandler';
import { GridEvents } from '../../models/events';

export type GridOverlayProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['overlay'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridOverlayRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Overlay',
  overridesResolver: (props, styles) => styles.overlay,
})(({ theme }) => ({
  display: 'flex',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.background.default, theme.palette.action.disabledOpacity),
}));

export const GridOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(function GridOverlay(
  props: GridOverlayProps,
  ref,
) {
  const { className, style, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const isMounted = React.useRef(true);

  const [viewportInnerSize, setViewportInnerSize] = React.useState(
    () => apiRef.current.getRootDimensions()?.viewportInnerSize ?? null,
  );

  // TODO: Remove the `isMounted` check
  // It is here because our event system does not handle correctly the removal of an event listener during the emit phase.
  // If you have an event that is listen by 2 listeners, and the 1st one causes the removal of the 2nd one, then the 2nd one will be ran.
  const handleViewportSizeChangeTest = () => {
    if (isMounted.current) {
      setViewportInnerSize(apiRef.current.getRootDimensions()?.viewportInnerSize ?? null);
    }
  };

  useGridApiEventHandler(apiRef, GridEvents.viewportInnerSizeChange, handleViewportSizeChangeTest);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <GridOverlayRoot
      ref={ref}
      className={clsx(classes.root, className)}
      style={{
        height: viewportInnerSize?.height ?? 0,
        width: viewportInnerSize?.width ?? 0,
        top: headerHeight,
        position: 'absolute',
        left: 0,
        ...style,
      }}
      {...other}
    />
  );
});
