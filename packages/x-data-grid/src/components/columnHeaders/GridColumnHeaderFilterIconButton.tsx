import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import useId from '@mui/utils/useId';
import { useGridSelector } from '../../hooks';
import {
  gridPreferencePanelSelectorWithLabel,
  gridPreferencePanelStateSelector,
} from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridIconButtonContainer } from './GridIconButtonContainer';
import type { GridColumnHeaderParams } from '../../models/params/gridColumnHeaderParams';

export interface ColumnHeaderFilterIconButtonProps {
  field: string;
  counter?: number;
  /**
   * If `true`, the icon is hidden when the column has no active filter.
   * Set it to `false` to show the icon on every filterable column, so a filter
   * can be added from the column header.
   * @default true
   */
  hideIconIfNoFilterAdded?: boolean;
  onClick?: (params: GridColumnHeaderParams, event: React.MouseEvent<HTMLButtonElement>) => void;
}

type OwnerState = ColumnHeaderFilterIconButtonProps & {
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    icon: ['filterIcon'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnHeaderFilterIconButtonWrapped(props: ColumnHeaderFilterIconButtonProps) {
  const { counter, hideIconIfNoFilterAdded = true } = props;
  if (!counter && hideIconIfNoFilterAdded) {
    return null;
  }
  return <GridColumnHeaderFilterIconButton {...props} />;
}

GridColumnHeaderFilterIconButtonWrapped.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  counter: PropTypes.number,
  field: PropTypes.string.isRequired,
  /**
   * If `true`, the icon is hidden when the column has no active filter.
   * Set it to `false` to show the icon on every filterable column, so a filter
   * can be added from the column header.
   * @default true
   */
  hideIconIfNoFilterAdded: PropTypes.bool,
  onClick: PropTypes.func,
} as any;

function GridColumnHeaderFilterIconButton(props: ColumnHeaderFilterIconButtonProps) {
  const { counter, field, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);
  const labelId = useId();
  const isOpen = useGridSelector(apiRef, gridPreferencePanelSelectorWithLabel, labelId);
  const panelId = useId();

  const toggleFilter = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const { open, openedPanelValue } = gridPreferencePanelStateSelector(apiRef);

      if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
        apiRef.current.hideFilterPanel();
      } else {
        // An unfiltered column gets a fresh filter item for itself.
        apiRef.current.showFilterPanel(counter ? undefined : field, panelId, labelId);
      }

      if (onClick) {
        onClick(apiRef.current.getColumnHeaderParams(field), event);
      }
    },
    [apiRef, counter, field, onClick, panelId, labelId],
  );

  if (!counter && !apiRef.current.getColumn(field)?.filterable) {
    return null;
  }

  const iconButton = (
    <rootProps.slots.baseIconButton
      id={labelId}
      onClick={toggleFilter}
      aria-label={apiRef.current.getLocaleText('columnHeaderFiltersLabel')}
      size="small"
      tabIndex={-1}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={isOpen ? panelId : undefined}
      {...rootProps.slotProps?.baseIconButton}
    >
      <rootProps.slots.columnFilteredIcon className={classes.icon} fontSize="small" />
    </rootProps.slots.baseIconButton>
  );

  return (
    <rootProps.slots.baseTooltip
      title={
        counter
          ? (apiRef.current.getLocaleText('columnHeaderFiltersTooltipActive')(
              counter,
            ) as React.ReactElement<any>)
          : apiRef.current.getLocaleText('columnHeaderFiltersLabel')
      }
      enterDelay={1000}
      {...rootProps.slotProps?.baseTooltip}
    >
      <GridIconButtonContainer>
        {counter && counter > 1 ? (
          <rootProps.slots.baseBadge badgeContent={counter} color="default">
            {iconButton}
          </rootProps.slots.baseBadge>
        ) : (
          iconButton
        )}
      </GridIconButtonContainer>
    </rootProps.slots.baseTooltip>
  );
}

GridColumnHeaderFilterIconButton.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  counter: PropTypes.number,
  field: PropTypes.string.isRequired,
  /**
   * If `true`, the icon is hidden when the column has no active filter.
   * Set it to `false` to show the icon on every filterable column, so a filter
   * can be added from the column header.
   * @default true
   */
  hideIconIfNoFilterAdded: PropTypes.bool,
  onClick: PropTypes.func,
} as any;

export { GridColumnHeaderFilterIconButtonWrapped as GridColumnHeaderFilterIconButton };
