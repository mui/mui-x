import * as React from 'react';
import { getDataGridUtilityClass } from '../gridClasses';
import { ElementSize } from '../models';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { composeClasses } from '../utils/material-ui-utils';
import { GridComponentProps } from '../GridComponentProps';

interface GridStickyContainerProps extends ElementSize {
  children: React.ReactNode;
}

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['viewport'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export function GridStickyContainer(props: GridStickyContainerProps) {
  const { height, width, children } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);
  return (
    <div
      className={classes.root}
      style={{
        minWidth: width,
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {children}
    </div>
  );
}
