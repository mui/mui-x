import * as React from 'react';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { composeClasses } from '../../utils/material-ui-utils';
import { GridComponentProps } from '../../GridComponentProps';

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['main'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export function GridMainContainer(props: React.PropsWithChildren<{}>) {
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);
  return <div className={classes.root}>{props.children}</div>;
}
