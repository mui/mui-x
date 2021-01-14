import * as React from 'react';
import { DATA_CONTAINER_CSS_CLASS } from '../../constants/cssClassesConstants';
import { useGridState } from '../../hooks/features/core/useGridState';
import { classnames } from '../../utils';
import { ApiContext } from '../api-context';

type GridDataContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function GridDataContainer(props: GridDataContainerProps) {
  const { className, ...other } = props;
  const apiRef = React.useContext(ApiContext);
  const [gridState] = useGridState(apiRef!);

  return (
    <div
      className={classnames('MuiDataGrid-dataContainer', DATA_CONTAINER_CSS_CLASS, className)}
      style={{
        minHeight: gridState.containerSizes?.dataContainerSizes?.height,
        minWidth: gridState.containerSizes?.dataContainerSizes?.width,
      }}
      {...other}
    />
  );
}
