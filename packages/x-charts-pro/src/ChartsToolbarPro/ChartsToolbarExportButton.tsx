'use client';

import * as React from 'react';
import { ToolbarButton } from '@mui/x-charts/Toolbar';
import { useChartContext } from '@mui/x-charts/context/ChartProvider';
import { useIsHydrated } from '@mui/x-charts/hooks/useIsHydrated';
import materialSlots, { type ChartsSlots } from '@mui/x-charts/material';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import { UseChartProExportSignature } from '../internals/plugins/useChartProExport';

type ChartsToolbarExportButtonSlots = Partial<
  Pick<ChartsSlots, 'baseMenu' | 'baseMenuItem' | 'baseTooltip' | 'exportIcon'>
>;

type ChartsToolbarExportButtonSlotProps = {
  [K in keyof Required<ChartsToolbarExportButtonSlots>]: React.ComponentProps<
    Required<ChartsToolbarExportButtonSlots>[K]
  >;
};

interface ChartsToolbarExportButtonProps {
  slots?: ChartsToolbarExportButtonSlots;
  slotProps?: ChartsToolbarExportButtonSlotProps;
}

export function ChartsToolbarExportButton({ slots, slotProps }: ChartsToolbarExportButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const handleClose = () => setMenuOpen(false);
  const { publicAPI } = useChartContext<[UseChartProExportSignature]>();
  const isHydrated = useIsHydrated();
  const ExportIcon = slots?.exportIcon ?? materialSlots.exportIcon;
  const Tooltip = slots?.baseTooltip ?? materialSlots.baseTooltip;
  const Menu = slots?.baseMenu ?? materialSlots.baseMenu;
  const MenuItem = slots?.baseMenuItem ?? materialSlots.baseMenuItem;
  const { localeText } = useChartsLocalization();
  const canExport = publicAPI.exportAsPrint || publicAPI.exportAsImage;

  if (!canExport) {
    return null;
  }

  return (
    <React.Fragment>
      <Tooltip title={localeText.export}>
        <ToolbarButton ref={buttonRef} onClick={() => setMenuOpen(true)}>
          <ExportIcon {...slotProps?.exportIcon} />
        </ToolbarButton>
      </Tooltip>
      {isHydrated && (
        <Menu anchorEl={() => buttonRef.current} open={menuOpen} onClose={handleClose}>
          {publicAPI.exportAsPrint ? (
            <MenuItem
              onClick={() => {
                publicAPI.exportAsPrint();
                handleClose();
              }}
            >
              {localeText.print}
            </MenuItem>
          ) : null}
          {publicAPI.exportAsImage ? (
            <MenuItem
              onClick={() => {
                publicAPI.exportAsImage();
                handleClose();
              }}
            >
              {localeText.exportAsImage}
            </MenuItem>
          ) : null}
        </Menu>
      )}
    </React.Fragment>
  );
}
