import * as React from 'react';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';
import { isOverflown } from '../../utils/domUtils';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { composeClasses } from '../../utils/material-ui-utils';
import { GridComponentProps } from '../../GridComponentProps';

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['columnHeaderTitle'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const ColumnHeaderInnerTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function ColumnHeaderInnerTitle(props, ref) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  return <div ref={ref} className={clsx(classes.root, className)} {...other} />;
});

export interface GridColumnHeaderTitleProps {
  label: string;
  columnWidth: number;
  description?: string;
}

// No React.memo here as if we display the sort icon, we need to recalculate the isOver
export function GridColumnHeaderTitle(props: GridColumnHeaderTitleProps) {
  const { label, description, columnWidth } = props;
  const titleRef = React.useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = React.useState('');

  React.useEffect(() => {
    if (!description && titleRef && titleRef.current) {
      const isOver = isOverflown(titleRef.current);
      if (isOver) {
        setTooltip(label);
      } else {
        setTooltip('');
      }
    }
  }, [titleRef, columnWidth, description, label]);

  return (
    <Tooltip title={description || tooltip}>
      <ColumnHeaderInnerTitle ref={titleRef}>{label}</ColumnHeaderInnerTitle>
    </Tooltip>
  );
}
