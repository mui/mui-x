import * as React from 'react';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import useId from '@mui/utils/useId';
import { styled } from '@mui/system';
import { Toolbar } from './Toolbar';
import { ToolbarButton } from './ToolbarButton';
import { FilterPanelTrigger } from '../filterPanel';
import { ColumnsPanelTrigger } from '../columnsPanel';
import { ExportCsv, ExportPrint } from '../export';
import { GridToolbarQuickFilter } from '../toolbar/GridToolbarQuickFilter';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridSlotProps } from '../../models/gridSlotsComponentsProps';
import { NotRendered } from '../../utils/assert';
import { vars } from '../../constants/cssVariables';

interface GridToolbarInternalProps {
  additionalItems?: React.ReactNode;
  additionalExportMenuItems?: (onMenuItemClick: () => void) => React.ReactNode;
}

export type GridToolbarProps = GridSlotProps['toolbar'] & GridToolbarInternalProps;

const Divider = styled(NotRendered<GridSlotProps['baseDivider']>, {
  name: 'MuiDataGrid',
  slot: 'ToolbarDivider',
})({
  height: '50%',
  margin: vars.spacing(0, 0.5),
});

function GridToolbarDivider() {
  const rootProps = useGridRootProps();
  return <Divider as={rootProps.slots.baseDivider} orientation="vertical" />;
}

function GridToolbar(props: GridToolbarProps) {
  const {
    showQuickFilter = true,
    quickFilterProps,
    csvOptions,
    printOptions,
    additionalItems,
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
              <ToolbarButton
                {...triggerProps}
                color={state.filterCount > 0 ? 'primary' : 'default'}
              >
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

      {additionalItems}

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
              onClick={() => setExportMenuOpen(true)}
            >
              <rootProps.slots.exportIcon fontSize="small" />
            </ToolbarButton>
          </rootProps.slots.baseTooltip>

          <Menu
            id={exportMenuId}
            anchorEl={exportMenuTriggerRef.current}
            open={exportMenuOpen}
            onClose={closeExportMenu}
            MenuListProps={{
              'aria-labelledby': exportMenuTriggerId,
            }}
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
          </Menu>
        </React.Fragment>
      )}

      {showQuickFilter && <GridToolbarQuickFilter {...quickFilterProps} />}
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

export { GridToolbar, GridToolbarDivider };
