// position: { vertical: 'top', horizontal: 'middle' },

export type LegendPosition = {
  /**
   * The vertical position of the legend.
   * @default 'top'
   */
  vertical?: 'top' | 'middle' | 'bottom';
  /**
   * The horizontal position of the legend.
   * @default 'middle'
   */
  horizontal?: 'left' | 'middle' | 'right';
};

export type ChartsLegendPosition = {
  /**
   * The position of the legend in relation to the chart.
   *
   * @default { vertical: 'top', horizontal: 'middle' }
   */
  legendPosition?: LegendPosition;
};
