import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { isOverflown } from '../../utils/domUtils';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';

type OwnerState = { classes: GridComponentProps['classes'] };

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
})(({ theme }) => ({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  fontWeight: theme.typography.fontWeightMedium,
}));

const ColumnHeaderInnerTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function ColumnHeaderInnerTitle(props, ref) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  return (
    <GridColumnHeaderTitleRoot ref={ref} className={clsx(classes.root, className)} {...other} />
  );
});

export interface GridColumnHeaderTitleProps {
  label: string;
  columnWidth: number;
  description?: string;
}

// No React.memo here as if we display the sort icon, we need to recalculate the isOver
function GridColumnHeaderTitle(props: GridColumnHeaderTitleProps) {
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

GridColumnHeaderTitle.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  columnWidth: PropTypes.number.isRequired,
  description: PropTypes.string,
  label: PropTypes.string.isRequired,
} as any;

export { GridColumnHeaderTitle };
