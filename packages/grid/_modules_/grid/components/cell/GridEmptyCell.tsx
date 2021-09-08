import * as React from 'react';
import { getDataGridUtilityClass } from '../../gridClasses';
import { GridComponentProps } from '../../GridComponentProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { composeClasses } from '../../utils/material-ui-utils';

export interface GridEmptyCellProps {
  width?: number;
  height?: number;
}

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['cell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const GridEmptyCell = React.memo(function GridEmptyCell({
  width,
  height,
}: GridEmptyCellProps) {
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  if (!width || !height) {
    return null;
  }

  return (
    <div
      style={{
        minWidth: width,
        maxWidth: width,
        lineHeight: `${height - 1}px`,
        minHeight: height,
        maxHeight: height,
      }}
      className={classes.root}
    />
  );
});
