import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { getDataGridUtilityClass, useGridSelector, GridRenderCellParams } from '@mui/x-data-grid';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { DataGridProProcessedProps } from '../models/dataGridProProps';
import { gridDetailPanelExpandedRowsContentCacheSelector } from '../hooks/features/detailPanel/gridDetailPanelSelector';
import { GridApiPro } from '../models/gridApiPro';

type OwnerState = { classes: DataGridProProcessedProps['classes']; isExpanded: boolean };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, isExpanded } = ownerState;

  const slots = {
    root: ['detailPanelToggleCell', isExpanded && 'detailPanelToggleCell--expanded'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const GridDetailPanelToggleCell = (props: GridRenderCellParams) => {
  const { id, value: isExpanded } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext<GridApiPro>();
  const ownerState: OwnerState = { classes: rootProps.classes, isExpanded };
  const classes = useUtilityClasses(ownerState);

  const contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
  const hasContent = React.isValidElement(contentCache[id]);

  const Icon = isExpanded
    ? rootProps.components.DetailPanelCollapseIcon
    : rootProps.components.DetailPanelExpandIcon;

  return (
    <IconButton
      size="small"
      tabIndex={-1}
      disabled={!hasContent}
      className={classes.root}
      aria-label={
        isExpanded
          ? apiRef.current.getLocaleText('collapseDetailPanel')
          : apiRef.current.getLocaleText('expandDetailPanel')
      }
    >
      <Icon fontSize="inherit" />
    </IconButton>
  );
};
