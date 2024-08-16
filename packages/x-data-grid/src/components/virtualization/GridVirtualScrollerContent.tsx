import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { SxProps, Theme } from '@mui/system';
import { styled } from '../../utils/styled';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

type OwnerState = DataGridProcessedProps;

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
  overridesResolver: (props, styles) => styles.virtualScrollerContent,
})<{ ownerState: OwnerState }>({});

const GridVirtualScrollerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sx?: SxProps<Theme> }
>(function GridVirtualScrollerContent(props, ref) {
  const rootProps = useGridRootProps();
  const overflowedContent = !rootProps.autoHeight && props.style?.minHeight === 'auto';
  const classes = useUtilityClasses(rootProps, overflowedContent);

  return (
    <VirtualScrollerContentRoot
      ref={ref}
      {...props}
      ownerState={rootProps}
      className={clsx(classes.root, props.className)}
    />
  );
});

export { GridVirtualScrollerContent };
