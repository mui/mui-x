import * as React from 'react';
import { GRID_DATA_CONTAINER_CSS_CLASS } from '../../constants/cssClassesConstants';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import {
  gridDataContainerSizesSelector,
  gridScrollBarSizeSelector,
} from '../../hooks/root/gridContainerSizesSelector';
import { classnames } from '../../utils';
import { GridApiContext } from '../GridApiContext';

type GridDataContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function GridDataContainer(props: GridDataContainerProps) {
  const { className, ...other } = props;
  const apiRef = React.useContext(GridApiContext);
  const dataContainerSizes = useGridSelector(apiRef!, gridDataContainerSizesSelector);
  const scrollBar = useGridSelector(apiRef!, gridScrollBarSizeSelector);

  const style: any = {
    minWidth: dataContainerSizes?.width,
  };

  if (scrollBar.hasScrollY) {
    style.minHeight = dataContainerSizes?.height!;
  }

  return (
    <div
      className={classnames('MuiDataGrid-dataContainer', GRID_DATA_CONTAINER_CSS_CLASS, className)}
      style={style}
      {...other}
    />
  );
}
