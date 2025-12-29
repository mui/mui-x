import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, SxProps, Theme } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { vars } from '../../constants/cssVariables';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

type OwnerState = Pick<DataGridProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['panelContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridPanelContentRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PanelContent',
})({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  flex: '1 1',
  maxHeight: 400,
  padding: vars.spacing(2.5, 1.5, 2, 1),
  gap: vars.spacing(2.5),
});

function GridPanelContent(props: React.HTMLAttributes<HTMLDivElement> & { sx?: SxProps<Theme> }) {
  const { className, ...other } = props;
  const { classes: rootPropsClasses } = useGridRootProps();
  const classes = useUtilityClasses({ classes: rootPropsClasses });

  return <GridPanelContentRoot className={clsx(classes.root, className)} {...other} />;
}

GridPanelContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridPanelContent };
