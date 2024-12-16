import * as React from 'react';
import MUIButton, { ButtonProps as MUIButtonProps } from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridToolbarUtilityClass } from '../../constants/gridToolbarClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface ToolbarButtonProps extends MUIButtonProps {
  /**
   * The color of the button.
   * @default 'inherit'
   */
  color?: MUIButtonProps['color'];
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    button: ['button'],
  };

  return composeClasses(slots, getDataGridToolbarUtilityClass, classes);
};

const StyledToolbarButton = styled(MUIButton, {
  name: 'MuiDataGridToolbar',
  slot: 'Button',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  minWidth: 0,
  padding: theme.spacing(1),
  variants: [
    {
      props: { color: 'inherit' },
      style: {
        color: (theme.vars || theme).palette.action.active,
        '&:disabled': {
          color: (theme.vars || theme).palette.action.disabled,
        },
        '&:hover': {
          textDecoration: 'none',
          // Reset on mouse devices
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.text.primaryChannel} / ${theme.vars.palette.action.hoverOpacity})`
            : alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity),
          '@media (hover: none)': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
  ],
}));

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(props, ref) {
    const { color = 'inherit', ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    return (
      <StyledToolbarButton
        ref={ref}
        color={color}
        className={classes.button}
        ownerState={rootProps}
        {...other}
      />
    );
  },
);

export { ToolbarButton };
