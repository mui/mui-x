'use client';
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
  additionalItems?: React.ReactNode;
  additionalExportMenuItems?: (onMenuItemClick: () => void) => React.ReactNode;
}

export type GridToolbarProps = GridSlotProps['toolbar'] & GridToolbarInternalProps;

type OwnerState = Pick<DataGridProcessedProps, 'classes'>;

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
  const { classes: classesRootProps, slots } = useGridRootProps();
  const classes = useUtilityClasses({ classes: classesRootProps });
  return (
    <Divider as={slots.baseDivider} orientation="vertical" className={classes.divider} {...other} />
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
  const { classes: classesRootProps } = useGridRootProps();
  const classes = useUtilityClasses({ classes: classesRootProps });
  return <Label className={classes.label} {...other} />;
}

function GridToolbar(props: GridToolbarProps) {
  const {
    showQuickFilter = true,
    quickFilterProps,
    csvOptions,
    printOptions,
    additionalItems,
    additionalExportMenuItems,
    ...other
  } = props;
  const apiRef = useGridApiContext();
  const { label, disableColumnSelector, disableColumnFilter, slots, slotProps } =
    useGridRootProps();
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
    <Toolbar {...other}>
      {label && <GridToolbarLabel>{label}</GridToolbarLabel>}

      {!disableColumnSelector && (
        <slots.baseTooltip title={apiRef.current.getLocaleText('toolbarColumns')}>
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <slots.columnSelectorIcon fontSize="small" />
          </ColumnsPanelTrigger>
        </slots.baseTooltip>
      )}

      {!disableColumnFilter && (
        <slots.baseTooltip title={apiRef.current.getLocaleText('toolbarFilters')}>
          <FilterPanelTrigger
            render={(triggerProps, state) => (
              <ToolbarButton
                {...triggerProps}
                color={state.filterCount > 0 ? 'primary' : 'default'}
              >
                <slots.baseBadge badgeContent={state.filterCount} color="primary" variant="dot">
                  <slots.openFilterButtonIcon fontSize="small" />
                </slots.baseBadge>
              </ToolbarButton>
            )}
          />
        </slots.baseTooltip>
      )}

      {additionalItems}

      {showExportMenu && (!disableColumnFilter || !disableColumnSelector) && <GridToolbarDivider />}

      {showExportMenu && (
        <React.Fragment>
          <slots.baseTooltip
            title={apiRef.current.getLocaleText('toolbarExport')}
            disableInteractive={exportMenuOpen}
          >
            <ToolbarButton
              ref={exportMenuTriggerRef}
              id={exportMenuTriggerId}
              aria-controls={exportMenuId}
              aria-haspopup="true"
              aria-expanded={exportMenuOpen ? 'true' : undefined}
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
            >
              <slots.exportIcon fontSize="small" />
            </ToolbarButton>
          </slots.baseTooltip>

          <GridMenu
            target={exportMenuTriggerRef.current}
            open={exportMenuOpen}
            onClose={closeExportMenu}
            position="bottom-end"
          >
            <slots.baseMenuList
              id={exportMenuId}
              aria-labelledby={exportMenuTriggerId}
              autoFocusItem
              {...slotProps?.baseMenuList}
            >
              {!printOptions?.disableToolbarButton && (
                <ExportPrint
                  render={<slots.baseMenuItem {...slotProps?.baseMenuItem} />}
                  options={printOptions}
                  onClick={closeExportMenu}
                >
                  {apiRef.current.getLocaleText('toolbarExportPrint')}
                </ExportPrint>
              )}
              {!csvOptions?.disableToolbarButton && (
                <ExportCsv
                  render={<slots.baseMenuItem {...slotProps?.baseMenuItem} />}
                  options={csvOptions}
                  onClick={closeExportMenu}
                >
                  {apiRef.current.getLocaleText('toolbarExportCSV')}
                </ExportCsv>
              )}
              {additionalExportMenuItems?.(closeExportMenu)}
            </slots.baseMenuList>
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
  additionalItems: PropTypes.node,
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
