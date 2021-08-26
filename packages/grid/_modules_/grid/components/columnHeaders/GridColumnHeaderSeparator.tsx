import * as React from 'react';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { composeClasses } from '../../utils/material-ui-utils';

export interface GridColumnHeaderSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  resizable: boolean;
  resizing: boolean;
  height: number;
}

const useUtilityClasses = (ownerState) => {
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

export const GridColumnHeaderSeparator = React.memo(function GridColumnHeaderSeparator(
  props: GridColumnHeaderSeparatorProps,
) {
  const { resizable, resizing, height, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ColumnResizeIcon = apiRef!.current.components!.ColumnResizeIcon!;
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
      <ColumnResizeIcon className={classes.icon} />
    </div>
  );
});
