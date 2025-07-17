import { ChartPluginSignature } from '../../models';
import { ChartSeriesType, DatasetType } from '../../../../models/seriesType/config';
import {
  ScaleName,
  AxisConfig,
  ChartsRotationAxisProps,
  ChartsRadiusAxisProps,
  RadiusAxis,
  RotationAxis,
  ChartsAxisData,
} from '../../../../models/axis';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';
import { UseChartInteractionSignature } from '../useChartInteraction';

export interface UseChartPolarAxisInstance {
  /**
   * Transform (rotation, radius) to the SVG (x, y).
   * @param {number} radius The radius.
   * @param {number} rotation The rotation angle in radian.
   * @returns {[number, number]} [x, y] the SVG coordinate.
   */
  polar2svg: (radius: number, rotation: number) => [number, number];
  /**
   * Transform the SVG (x, y) to the (rotation, radius) coordinates.
   * @param {number} x The SVG x coordinate.
   * @param {number} y The SVG y coordinate.
   * @returns {[number, number]} [radius, rotation] the polar coordinate. Warning, the radius is a the power 2
   */
  svg2polar: (x: number, y: number) => [number, number];
  /**
   * Only compute the rotation from SVG coordinates.
   * @param {number} x The SVG x coordinate.
   * @param {number} y The SVG y coordinate.
   * @returns {number} rotation The rotation angle in radian.
   */
  svg2rotation: (x: number, y: number) => number;
}

export interface UseChartPolarAxisParameters {
  /**
   * The configuration of the rotation-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  rotationAxis?: RotationAxis[];
  /**
   * The configuration of the radial-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  radiusAxis?: RadiusAxis[];
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: Readonly<DatasetType>;
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener?: boolean;
  /**
   * The function called for onClick events.
   * The second argument contains information about all line/bar elements at the current mouse position.
   * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
   * @param {null | ChartsAxisData} data The data about the clicked axis and items associated with it.
   */
  onAxisClick?: (event: MouseEvent, data: null | ChartsAxisData) => void;
}

export type UseChartPolarAxisDefaultizedParameters = UseChartPolarAxisParameters & {};

export interface UseChartPolarAxisState {
  polarAxis: {
    rotation: AxisConfig<ScaleName, any, ChartsRotationAxisProps>[];
    radius: AxisConfig<'linear', any, ChartsRadiusAxisProps>[];
  };
}

export type UseChartPolarAxisSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartPolarAxisParameters;
    defaultizedParams: UseChartPolarAxisDefaultizedParameters;
    state: UseChartPolarAxisState;
    instance: UseChartPolarAxisInstance;
    dependencies: [UseChartInteractionSignature, UseChartSeriesSignature<SeriesType>];
  }>;
