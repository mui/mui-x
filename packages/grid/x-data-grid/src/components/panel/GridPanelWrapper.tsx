import * as React from 'react';
import clsx from 'clsx';
import TrapFocus from '@mui/material/Unstable_TrapFocus';
import { styled, Theme } from '@mui/material/styles';
import { MUIStyledCommonProps } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
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

export interface GridPanelWrapperProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
    MUIStyledCommonProps<Theme> {}

const GridPanelWrapper = React.forwardRef<HTMLDivElement, GridPanelWrapperProps>(
  function GridPanelWrapper(props, ref) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);

    return (
      <TrapFocus open disableEnforceFocus isEnabled={isEnabled}>
        <GridPanelWrapperRoot
          ref={ref}
          tabIndex={-1}
          className={clsx(className, classes.root)}
          {...other}
        />
      </TrapFocus>
    );
  },
);

export { GridPanelWrapper };
