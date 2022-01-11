import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import TrapFocus from '@mui/material/Unstable_TrapFocus';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { getDataGridUtilityClass } from '../../gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['panelWrapper'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridPanelWrapperRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PanelWrapper',
  overridesResolver: (props, styles) => styles.panelWrapper,
})({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  '&:focus': {
    outline: 0,
  },
});

const isEnabled = () => true;

interface GridPanelWrapperProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  sx?: SxProps<Theme>;
}

function GridPanelWrapper(props: GridPanelWrapperProps) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  return (
    <TrapFocus open disableEnforceFocus isEnabled={isEnabled}>
      <GridPanelWrapperRoot tabIndex={-1} className={clsx(className, classes.root)} {...other} />
    </TrapFocus>
  );
}

GridPanelWrapper.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridPanelWrapper };
