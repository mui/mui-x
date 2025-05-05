'use client';

import * as React from 'react';
import { ToolbarButton } from '@mui/x-charts/Toolbar';
import { useChartContext } from '@mui/x-charts/internals';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import { ChartsSlotsPro, materialSlots } from '../../internals/material';
import { UseChartProZoomSignature } from '../../internals/plugins/useChartProZoom';

type ChartsToolbarZoomOutButtonSlots = Partial<Pick<ChartsSlotsPro, 'baseTooltip' | 'zoomOutIcon'>>;

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
  const { instance } = useChartContext<[UseChartProZoomSignature]>();
  const ZoomOutIcon = slots?.zoomOutIcon ?? materialSlots.zoomOutIcon;
  const Tooltip = slots?.baseTooltip ?? materialSlots.baseTooltip;
  const { localeText } = useChartsLocalization();

  return (
    <Tooltip title={localeText.zoomOut}>
      <ToolbarButton onClick={() => instance.zoomOut()}>
        <ZoomOutIcon {...slotProps?.zoomOutIcon} />
      </ToolbarButton>
    </Tooltip>
  );
}
