import { Toolbar, ChartsToolbarProps, ToolbarButton } from '@mui/x-charts/Toolbar';
import * as React from 'react';
import { useChartContext, useSelector, useChartsSlots } from '@mui/x-charts/internals';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import { selectorChartZoomIsEnabled } from '../internals/plugins/useChartProZoom';
import { ChartsToolbarZoomInTrigger } from './ChartsToolbarZoomInTrigger';
import { ChartsToolbarZoomOutTrigger } from './ChartsToolbarZoomOutTrigger';
import { ChartsSlotsPro } from '../internals/material';

/**
 * The chart toolbar component for the pro package.
 */
export function ChartsToolbarPro(props: React.PropsWithChildren<ChartsToolbarProps>) {
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const { store } = useChartContext();
  const { localeText } = useChartsLocalization();
  const isZoomEnabled = useSelector(store, selectorChartZoomIsEnabled);

  const children: Array<React.JSX.Element> = [];

  if (isZoomEnabled) {
    const Tooltip = slots.baseTooltip;
    const ZoomOutIcon = slots.zoomOutIcon;
    const ZoomInIcon = slots.zoomInIcon;

    children.push(
      <Tooltip key="zoom-in" {...slotProps.baseTooltip} title={localeText.zoomIn}>
        <ChartsToolbarZoomInTrigger render={<ToolbarButton />}>
          <ZoomInIcon {...slotProps.zoomInIcon} />
        </ChartsToolbarZoomInTrigger>
      </Tooltip>,
    );
    children.push(
      <Tooltip key="zoom-out" {...slotProps.baseTooltip} title={localeText.zoomOut}>
        <ChartsToolbarZoomOutTrigger render={<ToolbarButton />}>
          <ZoomOutIcon {...slotProps.zoomOutIcon} />
        </ChartsToolbarZoomOutTrigger>
      </Tooltip>,
    );
  }

  if (children.length === 0) {
    return null;
  }

  return <Toolbar {...props}>{children}</Toolbar>;
}
