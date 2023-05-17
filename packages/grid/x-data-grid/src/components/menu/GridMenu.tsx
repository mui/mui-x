import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses, HTMLElementType } from '@mui/utils';
import { SxProps, Theme } from '@mui/system';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

type MenuPosition =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top'
  | undefined;

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['menu'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};
export interface GridMenuProps {
  open: boolean;
  target: HTMLElement | null;
  onClickAway: (event: MouseEvent | TouchEvent) => void;
  position?: MenuPosition;
  onExited?: () => void;
  children: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

function GridMenu(props: GridMenuProps) {
  const { open, target, children, className } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  React.useEffect(() => {
    // Emit menuOpen or menuClose events
    const eventName = open ? 'menuOpen' : 'menuClose';
    apiRef.current.publishEvent(eventName, { target });
  }, [apiRef, open, target]);

  return (
    <rootProps.slots.baseMenu
      {...props}
      {...rootProps.slotProps?.baseMenu}
      className={clsx(className, classes.root)}
      sx={{
        zIndex: 'modal',
        [`& .${gridClasses.menuList}`]: {
          outline: 0,
        },
      }}
    >
      {children}
    </rootProps.slots.baseMenu>
  );
}

GridMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  className: PropTypes.string,
  onClickAway: PropTypes.func.isRequired,
  onExited: PropTypes.func,
  open: PropTypes.bool.isRequired,
  position: PropTypes.oneOf([
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  target: HTMLElementType,
} as any;

export { GridMenu };
