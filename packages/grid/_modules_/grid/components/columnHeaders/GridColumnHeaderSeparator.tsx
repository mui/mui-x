import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';

export interface GridColumnHeaderSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  resizable: boolean;
  resizing: boolean;
  height: number;
}

type OwnerState = GridColumnHeaderSeparatorProps & {
  classes?: GridComponentProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { resizable, resizing, classes } = ownerState;

  const slots = {
    root: [
      'columnSeparator',
      resizable && 'columnSeparator--resizable',
      resizing && 'columnSeparator--resizing',
    ],
    icon: ['iconSeparator'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnHeaderSeparatorRaw(props: GridColumnHeaderSeparatorProps) {
  const { resizable, resizing, height, ...other } = props;
  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const stopClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={classes.root}
      style={{ minHeight: height, opacity: rootProps.showColumnRightBorder ? 0 : 1 }}
      {...other}
      onClick={stopClick}
    >
      <rootProps.components.ColumnResizeIcon className={classes.icon} />
    </div>
  );
}

const GridColumnHeaderSeparator = React.memo(GridColumnHeaderSeparatorRaw);

GridColumnHeaderSeparatorRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  height: PropTypes.number.isRequired,
  resizable: PropTypes.bool.isRequired,
  resizing: PropTypes.bool.isRequired,
} as any;

export { GridColumnHeaderSeparator };
