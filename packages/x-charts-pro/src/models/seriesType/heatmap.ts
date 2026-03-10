import { type DefaultizedProps } from '@mui/x-internals/types';
import {
  type CommonDefaultizedProps,
  type CommonSeriesType,
  type CartesianSeriesType,
} from '@mui/x-charts/internals';

export type HeatmapValueType = readonly [number, number, number];

export interface HeatmapSeriesType
  extends
    Omit<CommonSeriesType<HeatmapValueType, 'heatmap'>, 'color' | 'colorGetter' | 'valueFormatter'>,
    CartesianSeriesType {
  type: 'heatmap';
  /**
   * Data associated to each cell in the heatmap.
   * Each entry is a tuple [xIndex, yIndex, value].
   */
  data?: readonly HeatmapValueType[];
  /**
   * The key used to retrieve data from the dataset.
   */
  dataKey?: string;
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * Function that formats values to be displayed in a tooltip.
   * @param {number | null} value The series' value to render. Can be `null` if the cell doesn't contain any value.
   * @param {{ xIndex: number; yIndex: number}} context The rendering context of the value.
   * @param {number} context.xIndex The x index of the cell the value belongs to.
   * @param {number} context.yIndex The y index of the cell the value belongs to.
   * @returns {string | null} The string to display or null if the value should not be shown.
   */
  valueFormatter?: (
    value: number | null,
    context: { xIndex: number; yIndex: number },
  ) => string | null;
}

/**
 * An object that allows to identify a single cell.
 * Used for item interaction
 */
export type HeatmapItemIdentifier = {
  type: 'heatmap';
  /**
   * The id of the series the cell belongs to.
   */
  seriesId: DefaultizedHeatmapSeriesType['id'];
  /**
   * The x index of the cell. Useful to identify the cell position in the heatmap even if there is no data.
   */
  xIndex: number;
  /**
   * The y index of the cell. Useful to identify the cell position in the heatmap even if there is no data.
   */
  yIndex: number;
};

/**
 * The cell identifier with the associated data value.
 */
export type HeatmapItemIdentifierWithData = HeatmapItemIdentifier & {
  /**
   * The value of the cell. Null if there is no data associated.
   */
  value: number | null;
};

export class HeatmapData {
  private valueLookup: Map<number, Map<number, number>>;

  constructor(data: readonly HeatmapValueType[]) {
    this.valueLookup = new Map();
    for (const [xIndex, yIndex, value] of data) {
      let column = this.valueLookup.get(xIndex);
      if (!column) {
        column = new Map<number, number>();
        this.valueLookup.set(xIndex, column);
      }

      column.set(yIndex, value);
    }
  }

  getValue(xIndex: number, yIndex: number): number | null {
    return this.valueLookup.get(xIndex)?.get(yIndex) ?? null;
  }
}

export interface DefaultizedHeatmapSeriesType extends DefaultizedProps<
  HeatmapSeriesType,
  CommonDefaultizedProps
> {
  /**
   * Maps the `xIndex` and `yIndex` to the corresponding value of the cell.
   */
  heatmapData: HeatmapData;
}
