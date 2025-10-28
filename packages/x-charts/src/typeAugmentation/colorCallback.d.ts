declare module '@mui/x-charts/models/seriesType/common' {
  // Augment the CommonSeriesType interface to update the color property

  type SeriesColorPropValue<TValue> = { value: TValue; dataIndex: number };
  type SeriesColorProp<TValue> = string | ((data: SeriesColorPropValue<TValue> | null) => string);

  interface SeriesColor<TValue> {
    /**
     * Color to use when displaying the series.
     * It can be a string representing a color or a function that returns a color based on the data index.
     * The data index can be undefined when the color is needed for the entire series (e.g., in legends, lines, areas).
     */
    color?: SeriesColorProp<TValue>;
  }
}
