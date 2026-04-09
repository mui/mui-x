'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Toolbar, type ChartsToolbarProps, ToolbarButton } from '@mui/x-charts/Toolbar';
import {
  useChartsContext,
  useChartsSlots,
  type UseChartCartesianAxisSignature,
  type AxisId,
} from '@mui/x-charts/internals';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import useId from '@mui/utils/useId';
import { ChartsToolbarDivider } from './internals/ChartsToolbarDivider';
import { ChartsMenu } from './internals/ChartsMenu';
import {
  selectorChartZoomIsEnabled,
  selectorChartActiveRangeButtonKey,
} from '../internals/plugins/useChartProZoom';
import { ChartsToolbarZoomInTrigger } from './ChartsToolbarZoomInTrigger';
import { ChartsToolbarZoomOutTrigger } from './ChartsToolbarZoomOutTrigger';
import { ChartsToolbarRangeButtonTrigger } from './ChartsToolbarRangeButtonTrigger';
import { type RangeButtonValue } from './rangeButtonValueToZoom';
import { type ChartsSlotsPro } from '../internals/material';
import {
  type ChartsToolbarPrintExportOptions,
  ChartsToolbarPrintExportTrigger,
} from './ChartsToolbarPrintExportTrigger';
import {
  type ChartsToolbarImageExportOptions,
  ChartsToolbarImageExportTrigger,
} from './ChartsToolbarImageExportTrigger';

export interface RangeButtonConfig {
  /**
   * The label displayed on the button (e.g., "1M", "3M", "1Y").
   */
  label: string;
  /**
   * The range value.
   *
   * - `{ unit, step }` — A calendar interval from the end of the data (e.g., `{ unit: 'month', step: 3 }` for 3 months).
   * - `[start, end]` — An absolute date range.
   * - `(domainMin, domainMax, zoomedMin, zoomedMax) => { start, end }` — A function that receives the full axis domain bounds and the current zoomed-in bounds (as timestamps) and returns zoom percentages.
   * - `null` — Resets zoom to show all data.
   */
  value: RangeButtonValue;
}

export interface ChartsToolbarProProps extends ChartsToolbarProps {
  printOptions?: ChartsToolbarPrintExportOptions;
  imageExportOptions?: ChartsToolbarImageExportOptions[];
  /**
   * Configuration for range buttons shown in the toolbar.
   * Each button zooms the chart to a predefined time range from the end of the data.
   */
  rangeButtons?: RangeButtonConfig[];
  /**
   * The axis ID to apply range buttons to.
   * Defaults to the first x-axis with zoom enabled and a time scale.
   */
  rangeButtonsAxisId?: AxisId;
}

const DEFAULT_IMAGE_EXPORT_OPTIONS: ChartsToolbarImageExportOptions[] = [{ type: 'image/png' }];

const RangeButtonGroup = styled(ToggleButtonGroup, {
  name: 'MuiChartsToolbarRangeButtons',
  slot: 'Root',
})({
  alignSelf: 'stretch',
  '& .MuiToggleButton-root': {
    fontSize: '0.75rem',
    minWidth: 'unset',
    border: 'none',
  },
});

/**
 * The chart toolbar component for the pro package.
 */
function ChartsToolbarPro({
  printOptions,
  imageExportOptions: rawImageExportOptions,
  rangeButtons,
  rangeButtonsAxisId,
  ...other
}: ChartsToolbarProProps) {
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const { store } = useChartsContext<[UseChartCartesianAxisSignature]>();
  const { localeText } = useChartsLocalization();
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
  const exportMenuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const exportMenuId = useId();
  const exportMenuTriggerId = useId();
  const isZoomEnabled = store.use(selectorChartZoomIsEnabled);
  const activeRangeButtonKey = store.use(selectorChartActiveRangeButtonKey);
  const imageExportOptionList = rawImageExportOptions ?? DEFAULT_IMAGE_EXPORT_OPTIONS;
  const showExportMenu = !printOptions?.disableToolbarButton || imageExportOptionList.length > 0;

  const children: Array<React.JSX.Element> = [];

  if (isZoomEnabled) {
    if (rangeButtons && rangeButtons.length > 0) {
      children.push(
        <RangeButtonGroup
          key="range-buttons"
          value={activeRangeButtonKey}
          exclusive
          size="small"
        >
          {rangeButtons.map((rangeButton) => (
            <ChartsToolbarRangeButtonTrigger
              key={rangeButton.label}
              value={rangeButton.value}
              buttonKey={rangeButton.label}
              axisId={rangeButtonsAxisId}
            >
              {rangeButton.label}
            </ChartsToolbarRangeButtonTrigger>
          ))}
        </RangeButtonGroup>,
      );
      children.push(<ChartsToolbarDivider key="range-divider" />);
    }

    const Tooltip = slots.baseTooltip;
    const ZoomOutIcon = slots.zoomOutIcon;
    const ZoomInIcon = slots.zoomInIcon;

    children.push(
      <Tooltip key="zoom-in" {...slotProps.baseTooltip} title={localeText.zoomIn}>
        <ChartsToolbarZoomInTrigger render={<ToolbarButton size="small" />}>
          <ZoomInIcon fontSize="small" {...slotProps.zoomInIcon} />
        </ChartsToolbarZoomInTrigger>
      </Tooltip>,
    );
    children.push(
      <Tooltip key="zoom-out" {...slotProps.baseTooltip} title={localeText.zoomOut}>
        <ChartsToolbarZoomOutTrigger render={<ToolbarButton size="small" />}>
          <ZoomOutIcon fontSize="small" {...slotProps.zoomOutIcon} />
        </ChartsToolbarZoomOutTrigger>
      </Tooltip>,
    );
  }

  if (showExportMenu) {
    const Tooltip = slots.baseTooltip;
    const MenuList = slots.baseMenuList;
    const MenuItem = slots.baseMenuItem;
    const ExportIcon = slots.exportIcon;

    const closeExportMenu = () => setExportMenuOpen(false);

    const handleListKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
      }

      if (isHideMenuKey(event.key)) {
        closeExportMenu();
      }
    };

    if (children.length > 0) {
      children.push(<ChartsToolbarDivider key="divider" />);
    }

    children.push(
      <React.Fragment key="export-menu">
        <Tooltip title={localeText.toolbarExport} disableInteractive={exportMenuOpen}>
          <ToolbarButton
            ref={exportMenuTriggerRef}
            id={exportMenuTriggerId}
            aria-controls={exportMenuId}
            aria-haspopup="true"
            aria-expanded={exportMenuOpen ? 'true' : undefined}
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            size="small"
          >
            <ExportIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>

        <ChartsMenu
          target={exportMenuTriggerRef.current}
          open={exportMenuOpen}
          onClose={closeExportMenu}
          position="bottom-end"
        >
          <MenuList
            id={exportMenuId}
            aria-labelledby={exportMenuTriggerId}
            onKeyDown={handleListKeyDown}
            autoFocusItem
            {...slotProps?.baseMenuList}
          >
            {!printOptions?.disableToolbarButton && (
              <ChartsToolbarPrintExportTrigger
                render={<MenuItem dense {...slotProps?.baseMenuItem} />}
                options={printOptions}
                onClick={closeExportMenu}
              >
                {localeText.toolbarExportPrint}
              </ChartsToolbarPrintExportTrigger>
            )}
            {imageExportOptionList.map((imageExportOptions) => (
              <ChartsToolbarImageExportTrigger
                key={imageExportOptions.type}
                render={<MenuItem dense {...slotProps?.baseMenuItem} />}
                options={imageExportOptions}
                onClick={closeExportMenu}
              >
                {localeText.toolbarExportImage(imageExportOptions.type)}
              </ChartsToolbarImageExportTrigger>
            ))}
          </MenuList>
        </ChartsMenu>
      </React.Fragment>,
    );
  }

  if (children.length === 0) {
    return null;
  }

  return <Toolbar {...other}>{children}</Toolbar>;
}

ChartsToolbarPro.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  imageExportOptions: PropTypes.arrayOf(
    PropTypes.shape({
      copyStyles: PropTypes.bool,
      fileName: PropTypes.string,
      nonce: PropTypes.string,
      onBeforeExport: PropTypes.func,
      quality: PropTypes.number,
      type: PropTypes.string.isRequired,
    }),
  ),
  printOptions: PropTypes.object,
  /**
   * Configuration for range buttons shown in the toolbar.
   * Each button zooms the chart to a predefined time range from the end of the data.
   */
  rangeButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.instanceOf(Date).isRequired),
        PropTypes.func,
        PropTypes.shape({
          step: PropTypes.number,
          unit: PropTypes.oneOf([
            'day',
            'hour',
            'microsecond',
            'millisecond',
            'minute',
            'month',
            'second',
            'week',
            'year',
          ]).isRequired,
        }),
      ]),
    }),
  ),
  /**
   * The axis ID to apply range buttons to.
   * Defaults to the first x-axis with zoom enabled and a time scale.
   */
  rangeButtonsAxisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
} as any;

export { ChartsToolbarPro };

function isHideMenuKey(key: React.KeyboardEvent['key']) {
  return key === 'Tab' || key === 'Escape';
}
