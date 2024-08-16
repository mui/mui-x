import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '../../utils/styled';
import { isOverflown } from '../../utils/domUtils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['columnHeaderTitle'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridColumnHeaderTitleRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderTitle',
  overridesResolver: (props, styles) => styles.columnHeaderTitle,
})<{ ownerState: OwnerState }>({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  fontWeight: 'var(--unstable_DataGrid-headWeight)',
});

const ColumnHeaderInnerTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function ColumnHeaderInnerTitle(props, ref) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return (
    <GridColumnHeaderTitleRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={rootProps}
      {...other}
    />
  );
});

export interface GridColumnHeaderTitleProps {
  label: string;
  columnWidth: number;
  description?: React.ReactNode;
}

// No React.memo here as if we display the sort icon, we need to recalculate the isOver
function GridColumnHeaderTitle(props: GridColumnHeaderTitleProps) {
  const { label, description } = props;
  const rootProps = useGridRootProps();
  const titleRef = React.useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = React.useState('');

  const handleMouseOver = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(() => {
    if (!description && titleRef?.current) {
      const isOver = isOverflown(titleRef.current);
      if (isOver) {
        setTooltip(label);
      } else {
        setTooltip('');
      }
    }
  }, [description, label]);

  return (
    <rootProps.slots.baseTooltip
      title={description || tooltip}
      {...rootProps.slotProps?.baseTooltip}
    >
      <ColumnHeaderInnerTitle onMouseOver={handleMouseOver} ref={titleRef}>
        {label}
      </ColumnHeaderInnerTitle>
    </rootProps.slots.baseTooltip>
  );
}

GridColumnHeaderTitle.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  columnWidth: PropTypes.number.isRequired,
  description: PropTypes.node,
  label: PropTypes.string.isRequired,
} as any;

export { GridColumnHeaderTitle };
