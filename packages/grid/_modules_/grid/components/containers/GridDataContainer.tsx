import * as React from 'react';
import clsx from 'clsx';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridDataContainerSizesSelector } from '../../hooks/root/gridContainerSizesSelector';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { gridClasses } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

type GridDataContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function GridDataContainer(props: GridDataContainerProps) {
  const { className, ...other } = props;
  const apiRef = useGridApiContext();
  const dataContainerSizes = useGridSelector(apiRef, gridDataContainerSizesSelector);
  const rootProps = useGridRootProps();

  const style: any = {
    // TODO remove min
    minWidth: dataContainerSizes?.width,
    minHeight: dataContainerSizes?.height,
  };

  return (
    <div
      className={clsx(gridClasses.dataContainer, className, rootProps.classes?.dataContainer)}
      style={style}
      {...other}
    />
  );
}
