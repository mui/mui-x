'use client';

import * as React from 'react';
import { ToolbarButton } from '@mui/x-charts/Toolbar';
import { useChartContext } from '@mui/x-charts/internals';
import { materialSlots, type ChartsSlots } from '@mui/x-charts/internals';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import { UseChartProZoomSignature } from '../../internals/plugins/useChartProZoom';

type ChartsToolbarZoomInButtonSlots = Partial<Pick<ChartsSlots, 'baseTooltip' | 'zoomInIcon'>>;

type ChartsToolbarZoomInButtonSlotProps = {
  [K in keyof Required<ChartsToolbarZoomInButtonSlots>]: React.ComponentProps<
    Required<ChartsToolbarZoomInButtonSlots>[K]
  >;
};

interface ChartsToolbarZoomInButtonProps {
  slots?: ChartsToolbarZoomInButtonSlots;
  slotProps?: ChartsToolbarZoomInButtonSlotProps;
}

export function ChartsToolbarZoomInButton({ slots, slotProps }: ChartsToolbarZoomInButtonProps) {
  const { instance } = useChartContext<[UseChartProZoomSignature]>();
  const ZoomInIcon = slots?.zoomInIcon ?? materialSlots.zoomInIcon;
  const Tooltip = slots?.baseTooltip ?? materialSlots.baseTooltip;
  const { localeText } = useChartsLocalization();

  return (
    <Tooltip title={localeText.zoomIn}>
      <ToolbarButton onClick={() => instance.zoomIn()}>
        <ZoomInIcon {...slotProps?.zoomInIcon} />
      </ToolbarButton>
    </Tooltip>
  );
}
