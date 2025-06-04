'use client';

import * as React from 'react';
import { Toolbar, ChartsToolbarProps, ToolbarButton, ToolbarDivider } from '@mui/x-charts/Toolbar';
import {
  useChartContext,
  useSelector,
  useChartsSlots,
  UseChartCartesianAxisSignature,
} from '@mui/x-charts/internals';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import useId from '@mui/utils/useId';
import { ChartsExportDisplayOptions } from './export.types';
import { ChartsMenu } from './ChartsMenu';
import { selectorChartZoomIsEnabled } from '../internals/plugins/useChartProZoom';
import { ChartsToolbarZoomInTrigger } from './ChartsToolbarZoomInTrigger';
import { ChartsToolbarZoomOutTrigger } from './ChartsToolbarZoomOutTrigger';
import { ChartsSlotsPro } from '../internals/material';
import {
  ChartsToolbarPrintExportOptions,
  ChartsToolbarPrintExportTrigger,
} from './ChartsToolbarPrintExportTrigger';
import { ChartsToolbarImageExportTrigger } from './ChartsToolbarImageExportTrigger';

interface ChartsToolbarProProps extends ChartsToolbarProps {
  printOptions?: ChartsToolbarPrintExportOptions;
  imageExportOptions?: ChartsExportDisplayOptions;
}

/**
 * The chart toolbar component for the pro package.
 */
export function ChartsToolbarPro({
  printOptions,
  imageExportOptions,
  ...other
}: ChartsToolbarProProps) {
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const { store } = useChartContext<[UseChartCartesianAxisSignature]>();
  const { localeText } = useChartsLocalization();
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
  const exportMenuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const exportMenuId = useId();
  const exportMenuTriggerId = useId();
  const isZoomEnabled = useSelector(store, selectorChartZoomIsEnabled);
  const showExportMenu =
    printOptions?.disableToolbarButton !== true ||
    imageExportOptions?.disableToolbarButton !== true;

  const children: Array<React.JSX.Element> = [];

  if (isZoomEnabled) {
    const Tooltip = slots.baseTooltip;
    const ZoomOutIcon = slots.zoomOutIcon;
    const ZoomInIcon = slots.zoomInIcon;

    children.push(
      <Tooltip key="zoom-in" {...slotProps.baseTooltip} title={localeText.zoomIn}>
        <ChartsToolbarZoomInTrigger render={<ToolbarButton />}>
          <ZoomInIcon fontSize="small" {...slotProps.zoomInIcon} />
        </ChartsToolbarZoomInTrigger>
      </Tooltip>,
    );
    children.push(
      <Tooltip key="zoom-out" {...slotProps.baseTooltip} title={localeText.zoomOut}>
        <ChartsToolbarZoomOutTrigger render={<ToolbarButton />}>
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
      children.push(<ToolbarDivider />);
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
                render={<MenuItem {...slotProps?.baseMenuItem} />}
                options={printOptions}
                onClick={closeExportMenu}
              >
                {localeText.toolbarExportPrint}
              </ChartsToolbarPrintExportTrigger>
            )}
            {!imageExportOptions?.disableToolbarButton && (
              <ChartsToolbarImageExportTrigger
                render={<MenuItem {...slotProps?.baseMenuItem} />}
                options={imageExportOptions}
                onClick={closeExportMenu}
              >
                {localeText.toolbarExportPng}
              </ChartsToolbarImageExportTrigger>
            )}
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

function isHideMenuKey(key: React.KeyboardEvent['key']) {
  return key === 'Tab' || key === 'Escape';
}
