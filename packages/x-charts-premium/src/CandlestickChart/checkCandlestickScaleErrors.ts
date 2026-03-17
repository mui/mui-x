import { type SeriesId } from '@mui/x-charts/models';
import { type D3Scale, isBandScale } from '@mui/x-charts/internals';

export function checkCandlestickScaleErrors(seriesId: SeriesId, xScale: D3Scale) {
  if (!isBandScale(xScale)) {
    throw new Error(
      `MUI X Charts: Series with ID "${seriesId}" should have an x-axis of type "band". ` +
        'Candlestick charts require a band scale for the x-axis. Set the scaleType to "band" for this axis.',
    );
  }
}
