import { type AllSeriesType } from '@mui/x-charts/models';
import { type OHLCValueType } from '../../models';

export function getSeriesWithDefaultValues(
  seriesData: AllSeriesType<'ohlc'>,
  seriesIndex: number,
  colors: readonly string[],
) {
  const bullishColor = colors[(seriesIndex * 2) % colors.length];
  const bearishColor = colors[(seriesIndex * 2 + 1) % colors.length];

  const defaultColorGetter = ({ value }: { value: OHLCValueType | null }) => {
    if (value === null) {
      return bullishColor;
    }
    const [open, , , close] = value;
    return close >= open ? bullishColor : bearishColor;
  };

  return {
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    color: seriesData.color ?? bullishColor,
    colorGetter: seriesData.colorGetter ?? defaultColorGetter,
  };
}
