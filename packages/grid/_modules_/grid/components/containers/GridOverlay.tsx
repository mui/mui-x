import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';
import { useGridApiEventHandler } from '../../hooks/utils/useGridApiEventHandler';
import { GridEvents } from '../../constants';

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

  const getOverlayPosition = React.useCallback((): React.CSSProperties | null => {
    const dimensions = apiRef.current.getRootDimensions();
    if (!dimensions) {
      return null;
    }

    return {
      height: dimensions.viewportInnerSize.height,
      width: dimensions.viewportInnerSize.width,
      bottom: 0,
      left: 0,
    };
  }, [apiRef]);

  const [position, setPosition] = React.useState(() => getOverlayPosition());

  const handleViewportSizeChange = React.useCallback(
    () => setPosition(getOverlayPosition()),
    [getOverlayPosition],
  );

  useGridApiEventHandler(apiRef, GridEvents.viewportInnerSizeChange, handleViewportSizeChange);

  return (
    <GridOverlayRoot
      ref={ref}
      className={clsx(classes.root, className)}
      style={{
        ...position,
        ...style,
      }}
      {...other}
    />
  );
});
