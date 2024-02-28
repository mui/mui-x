import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled, SxProps, Theme } from '@mui/system';
import { dataGridClasses, getDataGridUtilityClass } from '../../constants/dataGridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridDimensions } from '../../hooks/features/dimensions/gridDimensionsApi';

type OwnerState = DataGridProcessedProps &
  Pick<GridColumnHeadersInnerProps, 'isDragging'> & { hasScrollX: GridDimensions['hasScrollX'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { isDragging, hasScrollX, classes } = ownerState;

  const slots = {
    root: [
      'columnHeadersInner',
      isDragging && 'columnHeaderDropZone',
      hasScrollX && 'columnHeadersInner--scrollable',
    ],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridColumnHeadersInnerRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'columnHeadersInner',
  overridesResolver: (props, styles) => [
    { [`&.${dataGridClasses.columnHeaderDropZone}`]: styles.columnHeaderDropZone },
    styles.columnHeadersInner,
  ],
})<{ ownerState: OwnerState }>(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  [`&.${dataGridClasses.columnHeaderDropZone} .${dataGridClasses.columnHeaderDraggableContainer}`]:
    {
      cursor: 'move',
    },
  [`&.${dataGridClasses['columnHeadersInner--scrollable']} .${dataGridClasses.columnHeader}:last-child`]:
    {
      borderRight: 'none',
    },
}));

interface GridColumnHeadersInnerProps extends React.HTMLAttributes<HTMLDivElement> {
  isDragging: boolean;
  sx?: SxProps<Theme>;
}

export const GridColumnHeadersInner = React.forwardRef<HTMLDivElement, GridColumnHeadersInnerProps>(
  function GridColumnHeadersInner(props, ref) {
    const { isDragging, className, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();

    const ownerState = {
      ...rootProps,
      isDragging,
      hasScrollX: apiRef.current.getRootDimensions().hasScrollX,
    };
    const classes = useUtilityClasses(ownerState);

    return (
      <GridColumnHeadersInnerRoot
        ref={ref}
        className={clsx(className, classes.root)}
        ownerState={ownerState}
        {...other}
      />
    );
  },
);
