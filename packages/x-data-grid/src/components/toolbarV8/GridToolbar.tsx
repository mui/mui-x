import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { GridMenu } from '../menu/GridMenu';
import { Toolbar } from './Toolbar';
import { ToolbarButton } from './ToolbarButton';
import { FilterPanelTrigger } from '../filterPanel';
import { ColumnsPanelTrigger } from '../columnsPanel';
import { ExportCsv, ExportPrint } from '../export';
import { GridToolbarQuickFilter } from '../toolbar/GridToolbarQuickFilter';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridSlotProps } from '../../models/gridSlotsComponentsProps';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { NotRendered } from '../../utils/assert';
import { vars } from '../../constants/cssVariables';
import { getDataGridUtilityClass } from '../../constants/gridClasses';

interface GridToolbarInternalProps {
  additionalExportMenuItems?: (onMenuItemClick: () => void) => React.ReactNode;
}

export type GridToolbarProps = GridSlotProps['toolbar'] & GridToolbarInternalProps;

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    divider: ['toolbarDivider'],
    label: ['toolbarLabel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Divider = styled(NotRendered<GridSlotProps['baseDivider']>, {
  name: 'MuiDataGrid',
  slot: 'ToolbarDivider',
})({
  height: '50%',
  margin: vars.spacing(0, 0.5),
});

const Label = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ToolbarLabel',
})({
  flex: 1,
  font: vars.typography.font.large,
  fontWeight: vars.typography.fontWeight.medium,
  margin: vars.spacing(0, 0.5),
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

function GridToolbarDivider(props: GridSlotProps['baseDivider']) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  return (
    <Divider
      as={rootProps.slots.baseDivider}
      orientation="vertical"
      className={classes.divider}
      {...other}
    />
  );
}

GridToolbarDivider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
} as any;

function GridToolbarLabel(props: React.HTMLAttributes<HTMLSpanElement>) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  return <Label className={classes.label} {...other} />;
}

function GridToolbar(props: GridToolbarProps) {
  const {
    showQuickFilter = true,
    quickFilterProps,
    csvOptions,
    printOptions,
    additionalExportMenuItems,
  } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
  const exportMenuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const exportMenuId = useId();
  const exportMenuTriggerId = useId();
  const showExportMenu =
    !csvOptions?.disableToolbarButton ||
    !printOptions?.disableToolbarButton ||
    additionalExportMenuItems;
  const closeExportMenu = () => setExportMenuOpen(false);

  return (
    <Toolbar>
      {rootProps.label && <GridToolbarLabel>{rootProps.label}</GridToolbarLabel>}

      {!rootProps.disableColumnSelector && (
        <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarColumns')}>
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <rootProps.slots.columnSelectorIcon fontSize="small" />
          </ColumnsPanelTrigger>
        </rootProps.slots.baseTooltip>
      )}

      {!rootProps.disableColumnFilter && (
        <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarFilters')}>
          <FilterPanelTrigger
            render={(triggerProps, state) => (
              <ToolbarButton {...triggerProps} color="default">
                <rootProps.slots.baseBadge
                  badgeContent={state.filterCount}
                  color="primary"
                  variant="dot"
                >
                  <rootProps.slots.openFilterButtonIcon fontSize="small" />
                </rootProps.slots.baseBadge>
              </ToolbarButton>
            )}
          />
        </rootProps.slots.baseTooltip>
      )}

      {showExportMenu && (!rootProps.disableColumnFilter || !rootProps.disableColumnSelector) && (
        <GridToolbarDivider />
      )}

      {showExportMenu && (
        <React.Fragment>
          <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarExport')}>
            <ToolbarButton
              ref={exportMenuTriggerRef}
              id={exportMenuTriggerId}
              aria-controls={exportMenuId}
              aria-haspopup="true"
              aria-expanded={exportMenuOpen ? 'true' : undefined}
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
            >
              <rootProps.slots.exportIcon fontSize="small" />
            </ToolbarButton>
          </rootProps.slots.baseTooltip>

          <GridMenu
            target={exportMenuTriggerRef.current}
            open={exportMenuOpen}
            onClose={closeExportMenu}
            position="bottom-end"
          >
            <rootProps.slots.baseMenuList
              id={exportMenuId}
              aria-labelledby={exportMenuTriggerId}
              autoFocusItem
              {...rootProps.slotProps?.baseMenuList}
            >
              {!printOptions?.disableToolbarButton && (
                <ExportPrint
                  render={<rootProps.slots.baseMenuItem {...rootProps.slotProps?.baseMenuItem} />}
                  options={printOptions}
                  onClick={closeExportMenu}
                >
                  {apiRef.current.getLocaleText('toolbarExportPrint')}
                </ExportPrint>
              )}
              {!csvOptions?.disableToolbarButton && (
                <ExportCsv
                  render={<rootProps.slots.baseMenuItem {...rootProps.slotProps?.baseMenuItem} />}
                  options={csvOptions}
                  onClick={closeExportMenu}
                >
                  {apiRef.current.getLocaleText('toolbarExportCSV')}
                </ExportCsv>
              )}
              {additionalExportMenuItems?.(closeExportMenu)}
            </rootProps.slots.baseMenuList>
          </GridMenu>
        </React.Fragment>
      )}

      {showQuickFilter && (
        <React.Fragment>
          <GridToolbarDivider />
          <GridToolbarQuickFilter {...quickFilterProps} />
        </React.Fragment>
      )}
    </Toolbar>
  );
}

GridToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  additionalExportMenuItems: PropTypes.func,
  csvOptions: PropTypes.object,
  printOptions: PropTypes.object,
  /**
   * Props passed to the quick filter component.
   */
  quickFilterProps: PropTypes.shape({
    className: PropTypes.string,
    debounceMs: PropTypes.number,
    quickFilterFormatter: PropTypes.func,
    quickFilterParser: PropTypes.func,
    slotProps: PropTypes.object,
  }),
  /**
   * Show the quick filter component.
   * @default true
   */
  showQuickFilter: PropTypes.bool,
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridToolbar, GridToolbarDivider, GridToolbarLabel };
