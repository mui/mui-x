import * as React from 'react';
import clsx from 'clsx';
import { styled, SxProps, Theme } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

type OwnerState = Pick<DataGridProcessedProps, 'classes'> & { overflowedContent: boolean };

const useUtilityClasses = (props: DataGridProcessedProps, overflowedContent: boolean) => {
  const { classes } = props;

  const slots = {
    root: ['virtualScrollerContent', overflowedContent && 'virtualScrollerContent--overflowed'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const VirtualScrollerContentRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'VirtualScrollerContent',
  overridesResolver: (props, styles) => {
    const { ownerState } = props;
    return [
      styles.virtualScrollerContent,
      ownerState.overflowedContent && styles['virtualScrollerContent--overflowed'],
    ];
  },
})<{ ownerState: OwnerState }>({});

const GridVirtualScrollerContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sx?: SxProps<Theme> }
>(function GridVirtualScrollerContent(props, ref) {
  const rootProps = useGridRootProps();
  const overflowedContent = !rootProps.autoHeight && props.style?.minHeight === 'auto';
  const classes = useUtilityClasses(rootProps, overflowedContent);
  const ownerState = { classes: rootProps.classes, overflowedContent };

  return (
    <VirtualScrollerContentRoot
      {...props}
      ownerState={ownerState}
      className={clsx(classes.root, props.className)}
      ref={ref}
    />
  );
});

export { GridVirtualScrollerContent };
