import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { alpha, styled, lighten, darken } from '@mui/material/styles';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';

type GridColumnsContainerProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['columnsContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridColumnsContainerRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsContainer',
  overridesResolver: (props, styles) => styles.columnsContainer,
})(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light'
      ? lighten(alpha(theme.palette.divider, 1), 0.88)
      : darken(alpha(theme.palette.divider, 1), 0.68);

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${borderColor}`,
  };
});

export const GridColumnsContainer = React.forwardRef<HTMLDivElement, GridColumnsContainerProps>(
  function GridColumnsContainer(props, ref) {
    const { className, style, ...other } = props;
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    const apiRef = useGridApiContext();
    const height = useGridSelector(apiRef, gridDensityHeaderHeightSelector);

    return (
      <GridColumnsContainerRoot
        ref={ref}
        className={clsx(classes.root, className)}
        {...other}
        style={{ minHeight: height, maxHeight: height, lineHeight: `${height}px`, ...style }}
      />
    );
  },
);
