import * as React from 'react';
import { ElementSize } from '../models';
import { getDataGridUtilityClass } from '../gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { composeClasses } from '../utils/material-ui-utils';
import { GridComponentProps } from '../GridComponentProps';

type WithChildren = { children?: React.ReactNode };

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['renderingZone'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const GridRenderingZone = React.forwardRef<HTMLDivElement, ElementSize & WithChildren>(
  function GridRenderingZone(props, ref) {
    const { height, width, children } = props;
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    return (
      <div
        ref={ref}
        className={classes.root}
        style={{
          maxHeight: height,
          width,
        }}
      >
        {children}
      </div>
    );
  },
);
