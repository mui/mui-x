import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { SxProps, Theme } from '@mui/system';
import { styled } from '../../utils/styled';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

type OwnerState = DataGridProcessedProps;

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
  overridesResolver: (props, styles) => styles.panelContent,
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  flex: '1 1',
  maxHeight: 400,
});

function GridPanelContent(props: React.HTMLAttributes<HTMLDivElement> & { sx?: SxProps<Theme> }) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return (
    <GridPanelContentRoot
      className={clsx(className, classes.root)}
      ownerState={rootProps}
      {...other}
    />
  );
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
