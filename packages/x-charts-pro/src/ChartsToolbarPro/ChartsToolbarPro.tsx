import { Toolbar, ChartsToolbarProps } from '@mui/x-charts/Toolbar';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useChartContext, useSelector, useChartsSlots } from '@mui/x-charts/internals';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import { selectorChartZoomIsEnabled } from '../internals/plugins/useChartProZoom';
import { ChartsToolbarZoomInButton } from './ChartsToolbarZoomInButton';
import { ChartsToolbarZoomOutButton } from './ChartsToolbarZoomOutButton';
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
        <ChartsToolbarZoomInButton>
          <ZoomInIcon {...slotProps.zoomInIcon} />
        </ChartsToolbarZoomInButton>
      </Tooltip>,
    );
    children.push(
      <Tooltip key="zoom-out" {...slotProps.baseTooltip} title={localeText.zoomOut}>
        <ChartsToolbarZoomOutButton>
          <ZoomOutIcon {...slotProps.zoomOutIcon} />
        </ChartsToolbarZoomOutButton>
      </Tooltip>,
    );
  }

  if (children.length === 0) {
    return null;
  }

  return <Toolbar {...props}>{children}</Toolbar>;
}

ChartsToolbarPro.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
} as any;
