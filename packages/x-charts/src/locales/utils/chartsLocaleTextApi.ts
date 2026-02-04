import { type ChartImageExportMimeType } from './imageMimeTypes';

export interface ChartsLocaleText {
  /**
   * Title displayed in the overlay if `loading` is `true`.
   */
  loading: string;
  /**
   * Title displayed in the overlay if there is no data to display.
   */
  noData: string;
  /**
   * Tooltip text shown when hovering over the zoom in button.
   */
  zoomIn: string;
  /**
   * Tooltip text shown when hovering over the zoom out button.
   */
  zoomOut: string;
  /**
   * Text for the export button tooltip in the toolbar.
   */
  toolbarExport: string;
  /**
   * Text for the print button in the toolbar's export menu.
   */
  toolbarExportPrint: string;
  /**
   * Text for an "Export as {image type}" button in the toolbar's export menu.
   * The only format supported in all browsers is 'image/png'.
   *
   * @param {string} mimeType The MIME type of the image to export, e.g., 'image/png'.
   * @returns {string} The localized string for an export image button.
   */
  toolbarExportImage: (mimeType: ChartImageExportMimeType | (string & {})) => string;

  // Charts renderer configuration
  /**
   * Label for the bar chart type.
   */
  chartTypeBar: string;
  /**
   * Label for the column chart type.
   */
  chartTypeColumn: string;
  /**
   * Label for the line chart type.
   */
  chartTypeLine: string;
  /**
   * Label for the area chart type.
   */
  chartTypeArea: string;
  /**
   * Label for the pie chart type.
   */
  chartTypePie: string;
  /**
   * Label for the color palette control.
   */
  chartPaletteLabel: string;
  /**
   * Label for the rainbow surge palette.
   */
  chartPaletteNameRainbowSurge: string;
  /**
   * Label for the blueberry twilight palette.
   */
  chartPaletteNameBlueberryTwilight: string;
  /**
   * Label for the mango fusion palette.
   */
  chartPaletteNameMangoFusion: string;
  /**
   * Label for the cheerful fiesta palette.
   */
  chartPaletteNameCheerfulFiesta: string;
  /**
   * Label for the strawberry sky palette.
   */
  chartPaletteNameStrawberrySky: string;
  /**
   * Label for the blue palette.
   */
  chartPaletteNameBlue: string;
  /**
   * Label for the green palette.
   */
  chartPaletteNameGreen: string;
  /**
   * Label for the purple palette.
   */
  chartPaletteNamePurple: string;
  /**
   * Label for the red palette.
   */
  chartPaletteNameRed: string;
  /**
   * Label for the orange palette.
   */
  chartPaletteNameOrange: string;
  /**
   * Label for the yellow palette.
   */
  chartPaletteNameYellow: string;
  /**
   * Label for the cyan palette.
   */
  chartPaletteNameCyan: string;
  /**
   * Label for the pink palette.
   */
  chartPaletteNamePink: string;
  /**
   * Label for the chart configuration section.
   */
  chartConfigurationSectionChart: string;
  /**
   * Label for the axes configuration section.
   */
  chartConfigurationSectionAxes: string;
  /**
   * Label for the tooltip configuration section.
   */
  chartConfigurationSectionTooltip: string;
  /**
   * Label for the legend configuration section.
   */
  chartConfigurationSectionLegend: string;
  /**
   * Label for the columns configuration section.
   */
  chartConfigurationSectionColumns: string;
  /**
   * Label for the bars configuration section.
   */
  chartConfigurationSectionBars: string;
  /**
   * Label for the lines configuration section.
   */
  chartConfigurationSectionLines: string;
  /**
   * Label for the areas configuration section.
   */
  chartConfigurationSectionAreas: string;
  /**
   * Label for the arcs configuration section.
   */
  chartConfigurationSectionArcs: string;
  /**
   * Label for the grid configuration control.
   */
  chartConfigurationGrid: string;
  /**
   * Label for the border radius configuration control.
   */
  chartConfigurationBorderRadius: string;
  /**
   * Label for the category gap ratio configuration control.
   */
  chartConfigurationCategoryGapRatio: string;
  /**
   * Label for the bar gap ratio configuration control.
   */
  chartConfigurationBarGapRatio: string;
  /**
   * Label for the stacked configuration control.
   */
  chartConfigurationStacked: string;
  /**
   * Label for the skip animation configuration control.
   */
  chartConfigurationShowToolbar: string;
  /**
   * Label for the skip animation configuration control.
   */
  chartConfigurationSkipAnimation: string;
  /**
   * Label for the inner radius configuration control.
   */
  chartConfigurationInnerRadius: string;
  /**
   * Label for the outer radius configuration control.
   */
  chartConfigurationOuterRadius: string;
  /**
   * Label for the colors configuration control.
   */
  chartConfigurationColors: string;
  /**
   * Label for the hide legend configuration control.
   */
  chartConfigurationHideLegend: string;
  /**
   * Label for the show mark configuration control.
   */
  chartConfigurationShowMark: string;
  /**
   * Label for the height configuration control.
   */
  chartConfigurationHeight: string;
  /**
   * Label for the width configuration control.
   */
  chartConfigurationWidth: string;
  /**
   * Label for the series gap configuration control.
   */
  chartConfigurationSeriesGap: string;
  /**
   * Label for the tick placement configuration control.
   */
  chartConfigurationTickPlacement: string;
  /**
   * Label for the tick label placement configuration control.
   */
  chartConfigurationTickLabelPlacement: string;
  /**
   * Label for the categories axis label configuration control.
   */
  chartConfigurationCategoriesAxisLabel: string;
  /**
   * Label for the series axis label configuration control.
   */
  chartConfigurationSeriesAxisLabel: string;
  /**
   * Label for the X-axis position configuration control.
   */
  chartConfigurationXAxisPosition: string;
  /**
   * Label for the Y-axis position configuration control.
   */
  chartConfigurationYAxisPosition: string;
  /**
   * Label for the reverse series axis configuration control.
   */
  chartConfigurationSeriesAxisReverse: string;
  /**
   * Label for the tooltip placement configuration control.
   */
  chartConfigurationTooltipPlacement: string;
  /**
   * Label for the tooltip trigger configuration control.
   */
  chartConfigurationTooltipTrigger: string;
  /**
   * Label for the legend position configuration control.
   */
  chartConfigurationLegendPosition: string;
  /**
   * Label for the legend direction configuration control.
   */
  chartConfigurationLegendDirection: string;
  /**
   * Label for the bar labels configuration control.
   */
  chartConfigurationBarLabels: string;
  /**
   * Label for the column labels configuration control.
   */
  chartConfigurationColumnLabels: string;
  /**
   * Label for the interpolation configuration control.
   */
  chartConfigurationInterpolation: string;
  /**
   * Label for the padding angle configuration control.
   */
  chartConfigurationPaddingAngle: string;
  /**
   * Label for the corner radius configuration control.
   */
  chartConfigurationCornerRadius: string;
  /**
   * Label for the arc labels configuration control.
   */
  chartConfigurationArcLabels: string;
  /**
   * Label for the start angle configuration control.
   */
  chartConfigurationStartAngle: string;
  /**
   * Label for the end angle configuration control.
   */
  chartConfigurationEndAngle: string;
  /**
   * Label for the pie tooltip trigger configuration control.
   */
  chartConfigurationPieTooltipTrigger: string;
  /**
   * Label for the pie legend position configuration control.
   */
  chartConfigurationPieLegendPosition: string;
  /**
   * Label for the pie legend direction configuration control.
   */
  chartConfigurationPieLegendDirection: string;
  // Common option labels
  /**
   * Label for the "None" option.
   */
  chartConfigurationOptionNone: string;
  /**
   * Label for the "Value" option.
   */
  chartConfigurationOptionValue: string;
  /**
   * Label for the "Auto" option.
   */
  chartConfigurationOptionAuto: string;
  /**
   * Label for the "Top" option.
   */
  chartConfigurationOptionTop: string;
  /**
   * Label for the "Top Left" option.
   */
  chartConfigurationOptionTopLeft: string;
  /**
   * Label for the "Top Right" option.
   */
  chartConfigurationOptionTopRight: string;
  /**
   * Label for the "Bottom" option.
   */
  chartConfigurationOptionBottom: string;
  /**
   * Label for the "Bottom Left" option.
   */
  chartConfigurationOptionBottomLeft: string;
  /**
   * Label for the "Bottom Right" option.
   */
  chartConfigurationOptionBottomRight: string;
  /**
   * Label for the "Left" option.
   */
  chartConfigurationOptionLeft: string;
  /**
   * Label for the "Right" option.
   */
  chartConfigurationOptionRight: string;
  /**
   * Label for the "Axis" option.
   */
  chartConfigurationOptionAxis: string;
  /**
   * Label for the "Item" option.
   */
  chartConfigurationOptionItem: string;
  /**
   * Label for the "Horizontal" option.
   */
  chartConfigurationOptionHorizontal: string;
  /**
   * Label for the "Vertical" option.
   */
  chartConfigurationOptionVertical: string;
  /**
   * Label for the "Both" grid configuration option.
   */
  chartConfigurationOptionBoth: string;
  /**
   * Label for the "Start" option.
   */
  chartConfigurationOptionStart: string;
  /**
   * Label for the "Middle" option.
   */
  chartConfigurationOptionMiddle: string;
  /**
   * Label for the "End" option.
   */
  chartConfigurationOptionEnd: string;
  /**
   * Label for the "Extremities" option.
   */
  chartConfigurationOptionExtremities: string;
  /**
   * Label for the "Tick" option.
   */
  chartConfigurationOptionTick: string;
  /**
   * Label for the "Monotone X" interpolation option.
   */
  chartConfigurationOptionMonotoneX: string;
  /**
   * Label for the "Monotone Y" interpolation option.
   */
  chartConfigurationOptionMonotoneY: string;
  /**
   * Label for the "Catmull-Rom" interpolation option.
   */
  chartConfigurationOptionCatmullRom: string;
  /**
   * Label for the "Linear" interpolation option.
   */
  chartConfigurationOptionLinear: string;
  /**
   * Label for the "Natural" interpolation option.
   */
  chartConfigurationOptionNatural: string;
  /**
   * Label for the "Step" interpolation option.
   */
  chartConfigurationOptionStep: string;
  /**
   * Label for the "Step Before" interpolation option.
   */
  chartConfigurationOptionStepBefore: string;
  /**
   * Label for the "Step After" interpolation option.
   */
  chartConfigurationOptionStepAfter: string;
  /**
   * Label for the "Bump X" interpolation option.
   */
  chartConfigurationOptionBumpX: string;
  /**
   * Label for the "Bump Y" interpolation option.
   */
  chartConfigurationOptionBumpY: string;
}

export type ChartsTranslationKeys = keyof ChartsLocaleText;
