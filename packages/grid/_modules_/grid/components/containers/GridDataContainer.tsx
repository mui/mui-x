import * as React from 'react';
import clsx from 'clsx';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridDataContainerSizesSelector } from '../../hooks/features/container/gridContainerSizesSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { composeClasses } from '../../utils/material-ui-utils';
import { GridComponentProps } from '../../GridComponentProps';

type GridDataContainerProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['dataContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export function GridDataContainer(props: GridDataContainerProps) {
  const { className, ...other } = props;
  const apiRef = useGridApiContext();
  const dataContainerSizes = useGridSelector(apiRef, gridDataContainerSizesSelector);
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const style: any = {
    // TODO remove min
    minWidth: dataContainerSizes?.width,
    minHeight: dataContainerSizes?.height,
  };

  return <div className={clsx(classes.root, className)} style={style} {...other} />;
}
