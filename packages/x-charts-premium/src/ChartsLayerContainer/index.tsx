import * as React from 'react';
import { Watermark } from '@mui/x-license/Watermark';
import {
  ChartsLayerContainer as CommunityChartsLayerContainer,
  type ChartsLayerContainerProps,
} from '@mui/x-charts/ChartsLayerContainer';

const releaseInfo = '__RELEASE_INFO__';
const packageIdentifier = 'x-charts-premium';

/**
 * A component that contains the chart layers, such as `<ChartsSvgLayer>`, and `<ChartsWebGlLayer>`.
 * It is responsible for positioning itself and providing the dimensions and interaction context to its children layers.
 */
const ChartsLayerContainer = React.forwardRef<HTMLDivElement, ChartsLayerContainerProps>(
  function ChartsLayerContainer(props, ref) {
    const { children, ...other } = props;
    return (
      <CommunityChartsLayerContainer ref={ref} {...other}>
        {children}
        <Watermark packageName={packageIdentifier} releaseInfo={releaseInfo} />
      </CommunityChartsLayerContainer>
    );
  },
);

export { ChartsLayerContainer };
export type { ChartsLayerContainerProps };
