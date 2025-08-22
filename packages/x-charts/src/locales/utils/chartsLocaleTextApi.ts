import { ChartImageExportMimeType } from './imageMimeTypes';

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
   * Label for the columns configuration section.
   */
  chartConfigurationSectionColumns: string;
  /**
   * Label for the bars configuration section.
   */
  chartConfigurationSectionBars: string;
  /**
   * Label for the grid configuration control.
   */
  chartConfigurationGrid: string;
  /**
   * Label for the horizontal grid configuration option.
   */
  chartConfigurationGridHorizontal: string;
  /**
   * Label for the vertical grid configuration option.
   */
  chartConfigurationGridVertical: string;
  /**
   * Label for the option that enables both horizontal and vertical grid lines.
   */
  chartConfigurationGridBoth: string;
  /**
   * Label for the option that disables grid lines.
   */
  chartConfigurationGridNone: string;
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
   * Label for the start tick placement configuration option.
   */
  chartConfigurationTickPlacementStart: string;
  /**
   * Label for the middle tick placement configuration option.
   */
  chartConfigurationTickPlacementMiddle: string;
  /**
   * Label for the end tick placement configuration option.
   */
  chartConfigurationTickPlacementEnd: string;
  /**
   * Label for the extremities tick placement configuration option.
   */
  chartConfigurationTickPlacementExtremities: string;
  /**
   * Label for the tick label placement configuration control.
   */
  chartConfigurationTickLabelPlacement: string;
  /**
   * Label for the tick label placement configuration option.
   */
  chartConfigurationTickLabelPlacementTick: string;
  /**
   * Label for the middle tick label placement configuration option.
   */
  chartConfigurationTickLabelPlacementMiddle: string;
}

export type ChartsTranslationKeys = keyof ChartsLocaleText;
