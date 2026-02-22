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
   * Labels for the chart configuration panel.
   */
  chartConfiguration: {
    /** Labels for configuration sections. */
    section: {
      /** Label for the chart section. */
      chart: string;
      /** Label for the columns section. */
      columns: string;
      /** Label for the bars section. */
      bars: string;
      /** Label for the axes section. */
      axes: string;
    };
    /** Label for the grid control. */
    grid: string;
    /** Label for the border radius control. */
    borderRadius: string;
    /** Label for the category gap ratio control. */
    categoryGapRatio: string;
    /** Label for the bar gap ratio control. */
    barGapRatio: string;
    /** Label for the stacked control. */
    stacked: string;
    /** Label for the show toolbar control. */
    showToolbar: string;
    /** Label for the skip animation control. */
    skipAnimation: string;
    /** Label for the inner radius control. */
    innerRadius: string;
    /** Label for the outer radius control. */
    outerRadius: string;
    /** Label for the colors control. */
    colors: string;
    /** Label for the hide legend control. */
    hideLegend: string;
    /** Label for the show mark control. */
    showMark: string;
    /** Label for the height control. */
    height: string;
    /** Label for the width control. */
    width: string;
    /** Label for the series gap control. */
    seriesGap: string;
    /** Label for the tick placement control. */
    tickPlacement: string;
    /** Label for the tick label placement control. */
    tickLabelPlacement: string;
    /** Label for the categories axis label control. */
    categoriesAxisLabel: string;
    /** Label for the series axis label control. */
    seriesAxisLabel: string;
    /** Label for the X-axis position control. */
    xAxisPosition: string;
    /** Label for the Y-axis position control. */
    yAxisPosition: string;
    /** Label for the reverse series axis control. */
    axisReverse: string;
    /** Label for the tooltip placement control. */
    tooltipPlacement: string;
    /** Label for the tooltip trigger control. */
    tooltipTrigger: string;
    /** Label for the legend position control. */
    legendPosition: string;
    /** Label for the legend direction control. */
    legendDirection: string;
    /** Label for the bar labels control. */
    barLabels: string;
    /** Label for the column labels control. */
    columnLabels: string;
    /** Label for the interpolation control. */
    interpolation: string;
    /** Label for the tooltip section. */
    sectionTooltip: string;
    /** Label for the legend section. */
    sectionLegend: string;
    /** Label for the lines section. */
    sectionLines: string;
    /** Label for the areas section. */
    sectionAreas: string;
    /** Label for the arcs section. */
    sectionArcs: string;
    /** Label for the padding angle control. */
    paddingAngle: string;
    /** Label for the corner radius control. */
    cornerRadius: string;
    /** Label for the arc labels control. */
    arcLabels: string;
    /** Label for the start angle control. */
    startAngle: string;
    /** Label for the end angle control. */
    endAngle: string;
    /** Label for the pie tooltip trigger control. */
    pieTooltipTrigger: string;
    /** Label for the pie legend position control. */
    pieLegendPosition: string;
    /** Label for the pie legend direction control. */
    pieLegendDirection: string;
    /** Labels for configuration options. */
    option: {
      /** Label for the "None" option. */
      none: string;
      /** Label for the "Value" option. */
      value: string;
      /** Label for the "Auto" option. */
      auto: string;
      /** Label for the "Top" option. */
      top: string;
      /** Label for the "Top Left" option. */
      topLeft: string;
      /** Label for the "Top Right" option. */
      topRight: string;
      /** Label for the "Bottom" option. */
      bottom: string;
      /** Label for the "Bottom Left" option. */
      bottomLeft: string;
      /** Label for the "Bottom Right" option. */
      bottomRight: string;
      /** Label for the "Left" option. */
      left: string;
      /** Label for the "Right" option. */
      right: string;
      /** Label for the "Axis" option. */
      axis: string;
      /** Label for the "Item" option. */
      item: string;
      /** Label for the "Horizontal" option. */
      horizontal: string;
      /** Label for the "Vertical" option. */
      vertical: string;
      /** Label for the "Both" option. */
      both: string;
      /** Label for the "Start" option. */
      start: string;
      /** Label for the "Middle" option. */
      middle: string;
      /** Label for the "End" option. */
      end: string;
      /** Label for the "Extremities" option. */
      extremities: string;
      /** Label for the "Tick" option. */
      tick: string;
      /** Label for the "Monotone X" option. */
      monotoneX: string;
      /** Label for the "Monotone Y" option. */
      monotoneY: string;
      /** Label for the "Catmull-Rom" option. */
      catmullRom: string;
      /** Label for the "Linear" option. */
      linear: string;
      /** Label for the "Natural" option. */
      natural: string;
      /** Label for the "Step" option. */
      step: string;
      /** Label for the "Step Before" option. */
      stepBefore: string;
      /** Label for the "Step After" option. */
      stepAfter: string;
      /** Label for the "Bump X" option. */
      bumpX: string;
      /** Label for the "Bump Y" option. */
      bumpY: string;
    };
  };
}

export type ChartsTranslationKeys = keyof ChartsLocaleText;
