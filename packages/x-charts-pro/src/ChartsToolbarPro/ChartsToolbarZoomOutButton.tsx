'use client';

import * as React from 'react';
import { ToolbarButton } from '@mui/x-charts/Toolbar';
import { useChartContext } from '@mui/x-charts/internals';
import materialSlots, { type ChartsSlots } from '@mui/x-charts/material';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import { UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

type ChartsToolbarZoomOutButtonSlots = Partial<Pick<ChartsSlots, 'baseTooltip' | 'zoomOutIcon'>>;

type ChartsToolbarZoomOutButtonSlotProps = {
  [K in keyof Required<ChartsToolbarZoomOutButtonSlots>]: React.ComponentProps<
    Required<ChartsToolbarZoomOutButtonSlots>[K]
  >;
};

interface ChartsToolbarZoomOutButtonProps {
  slots?: ChartsToolbarZoomOutButtonSlots;
  slotProps?: ChartsToolbarZoomOutButtonSlotProps;
}

export function ChartsToolbarZoomOutButton({ slots, slotProps }: ChartsToolbarZoomOutButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { instance } = useChartContext<[UseChartProZoomSignature]>();
  const ZoomOutIcon = slots?.zoomOutIcon ?? materialSlots.zoomOutIcon;
  const Tooltip = slots?.baseTooltip ?? materialSlots.baseTooltip;
  const { localeText } = useChartsLocalization();

  return (
    <Tooltip title={localeText.zoomOut}>
      <ToolbarButton ref={buttonRef} onClick={() => instance.zoomOut()}>
        <ZoomOutIcon {...slotProps?.zoomOutIcon} />
      </ToolbarButton>
    </Tooltip>
  );
}
