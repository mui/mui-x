// position: { vertical: 'top', horizontal: 'middle' },

export type LegendPosition = {
  /**
   * The vertical position of the legend.
   */
  vertical?: 'top' | 'middle' | 'bottom';
  /**
   * The horizontal position of the legend.
   */
  horizontal?: 'left' | 'middle' | 'right';
};

export type ChartsLegendPosition = {
  /**
   * The position of the legend in relation to the chart.
   */
  legendPosition?: LegendPosition;
};
