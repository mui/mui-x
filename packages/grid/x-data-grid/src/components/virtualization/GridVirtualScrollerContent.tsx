import * as React from 'react';
import clsx from 'clsx';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

type OwnerState = DataGridProcessedProps & { overflowedContent: boolean };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, overflowedContent } = ownerState;

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
  const { className, style, ...other } = props;
  const rootProps = useGridRootProps();
  const ownerState = {
    ...rootProps,
    overflowedContent: !rootProps.autoHeight && style?.minHeight === 'auto',
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <VirtualScrollerContentRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      style={style}
      {...other}
    />
  );
});

export { GridVirtualScrollerContent };
