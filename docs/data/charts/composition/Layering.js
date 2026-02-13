import * as React from 'react';
import { ChartDataProviderPremium } from '@mui/x-charts-premium/ChartDataProviderPremium';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts/ChartsSvgLayer';
import { ChartsWebGlLayer } from '@mui/x-charts/ChartsWebGlLayer';
import { CandlestickPlot } from '@mui/x-charts-premium/CandlestickChart';

const ohlcData = [
  [100, 110, 95, 105],
  [105, 115, 100, 112],
  [112, 120, 108, 118],
  [118, 125, 115, 120],
  [120, 128, 118, 125],
  [125, 130, 120, 122],
  [122, 128, 118, 126],
  [126, 135, 124, 132],
  [132, 140, 130, 138],
  [138, 145, 135, 135],
  [135, 148, 138, 145],
  [145, 152, 142, 148],
  [148, 155, 145, 150],
  [150, 158, 148, 152],
  [152, 162, 151, 151],
  [151, 165, 151, 157],
  [157, 168, 153, 153],
  [153, 160, 151, 152],
  [152, 155, 150, 154],
  [154, 158, 153, 157],
];

const xAxisData = ohlcData.map((_, index) => `Day ${index + 1}`);

export default function Layering() {
  return (
    <ChartDataProviderPremium
      height={600}
      series={[
        {
          type: 'ohlc',
          data: ohlcData,
          label: 'Stock Price',
        },
      ]}
      xAxis={[{ scaleType: 'band', data: xAxisData }]}
      yAxis={[{ label: 'Price' }]}
    >
      <ChartsWrapper>
        <ChartsLayerContainer>
          <ChartsSvgLayer>
            <ChartsGrid horizontal />
          </ChartsSvgLayer>
          <ChartsWebGlLayer>
            <CandlestickPlot />
          </ChartsWebGlLayer>
          <ChartsSvgLayer>
            <ChartsXAxis />
            <ChartsYAxis />
            <ChartsAxisHighlight x="line" y="line" />
          </ChartsSvgLayer>
          <ChartsTooltip />
        </ChartsLayerContainer>
      </ChartsWrapper>
    </ChartDataProviderPremium>
  );
}
