'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ChartsToolbarProps, ToolbarButton } from '@mui/x-charts/Toolbar';
import { useChartContext, useSelector, useChartsSlots } from '@mui/x-charts/internals';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import useId from '@mui/utils/useId';
import { ChartsToolbarDivider } from './internals/ChartsToolbarDivider';
import { ChartsMenu } from './internals/ChartsMenu';
import { selectorChartZoomIsEnabled } from '../internals/plugins/useChartProZoom';
import { ChartsToolbarZoomInTrigger } from './ChartsToolbarZoomInTrigger';
import { ChartsToolbarZoomOutTrigger } from './ChartsToolbarZoomOutTrigger';
import { ChartsSlotsPro } from '../internals/material';
import {
  ChartsToolbarPrintExportOptions,
  ChartsToolbarPrintExportTrigger,
} from './ChartsToolbarPrintExportTrigger';
import {
  ChartsToolbarImageExportOptions,
  ChartsToolbarImageExportTrigger,
} from './ChartsToolbarImageExportTrigger';

export interface ChartsToolbarProProps extends ChartsToolbarProps {
  printOptions?: ChartsToolbarPrintExportOptions;
  imageExportOptions?: ChartsToolbarImageExportOptions[];
}

const DEFAULT_IMAGE_EXPORT_OPTIONS: ChartsToolbarImageExportOptions[] = [{ type: 'image/png' }];

/**
 * The chart toolbar component for the pro package.
 */
function ChartsToolbarPro({
  printOptions,
  imageExportOptions: rawImageExportOptions,
  ...other
}: ChartsToolbarProProps) {
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const { store } = useChartContext();
  const { localeText } = useChartsLocalization();
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
  const exportMenuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const exportMenuId = useId();
  const exportMenuTriggerId = useId();
  const isZoomEnabled = useSelector(store, selectorChartZoomIsEnabled);
  const imageExportOptionList = rawImageExportOptions ?? DEFAULT_IMAGE_EXPORT_OPTIONS;
  const showExportMenu = !printOptions?.disableToolbarButton || imageExportOptionList.length > 0;

  const children: Array<React.JSX.Element> = [];

  if (isZoomEnabled) {
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
        <Tooltip title={localeText.toolbarExport}>
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
      fileName: PropTypes.string,
      quality: PropTypes.number,
      type: PropTypes.string.isRequired,
    }),
  ),
  printOptions: PropTypes.object,
} as any;

export { ChartsToolbarPro };

function isHideMenuKey(key: React.KeyboardEvent['key']) {
  return key === 'Tab' || key === 'Escape';
}
