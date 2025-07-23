import { AxisId, ChartRootSelector } from '@mui/x-charts/internals';
import { UseChartProZoomSignature } from './useChartProZoom.types';
export declare const selectorChartZoomState: ChartRootSelector<UseChartProZoomSignature>;
export declare const selectorChartZoomIsInteracting: import("reselect").Selector<import("@mui/x-charts/internals/plugins/corePlugins/useChartId/useChartId.types").UseChartIdState & import("@mui/x-charts/internals/plugins/corePlugins/useChartExperimentalFeature/useChartExperimentalFeature.types").UseChartExperimentalFeaturesState & import("@mui/x-charts/internals/plugins/corePlugins/useChartDimensions/useChartDimensions.types").UseChartDimensionsState & import("@mui/x-charts/internals/plugins/corePlugins/useChartSeries/useChartSeries.types").UseChartSeriesState<keyof import("@mui/x-charts/internals").ChartsSeriesConfig> & import("@mui/x-charts/internals/plugins/corePlugins/useChartAnimation/useChartAnimation.types").UseChartAnimationState & import("@mui/x-charts/internals").UseChartInteractionListenerState & import("./useChartProZoom.types").UseChartProZoomState & Partial<{}> & {
    cacheKey: import("@mui/x-charts/internals").ChartStateCacheKey;
} & {
    cacheKey: import("@mui/x-charts/internals").ChartStateCacheKey;
}, boolean, any[]>;
export declare const selectorChartZoomIsEnabled: import("reselect").Selector<import("@mui/x-charts/internals/plugins/corePlugins/useChartId/useChartId.types").UseChartIdState & import("@mui/x-charts/internals/plugins/corePlugins/useChartExperimentalFeature/useChartExperimentalFeature.types").UseChartExperimentalFeaturesState & import("@mui/x-charts/internals/plugins/corePlugins/useChartDimensions/useChartDimensions.types").UseChartDimensionsState & import("@mui/x-charts/internals/plugins/corePlugins/useChartSeries/useChartSeries.types").UseChartSeriesState<keyof import("@mui/x-charts/internals").ChartsSeriesConfig> & import("@mui/x-charts/internals/plugins/corePlugins/useChartAnimation/useChartAnimation.types").UseChartAnimationState & import("@mui/x-charts/internals").UseChartInteractionListenerState & Partial<import("@mui/x-charts/internals").UseChartCartesianAxisState> & {
    cacheKey: import("@mui/x-charts/internals").ChartStateCacheKey;
} & {
    cacheKey: import("@mui/x-charts/internals").ChartStateCacheKey;
}, boolean, []>;
export declare const selectorChartAxisZoomData: import("reselect").Selector<any, import("@mui/x-charts/internals").ZoomData | undefined, [axisId: AxisId]>;
export declare const selectorChartCanZoomOut: import("reselect").Selector<import("@mui/x-charts/internals/plugins/corePlugins/useChartId/useChartId.types").UseChartIdState & import("@mui/x-charts/internals/plugins/corePlugins/useChartExperimentalFeature/useChartExperimentalFeature.types").UseChartExperimentalFeaturesState & import("@mui/x-charts/internals/plugins/corePlugins/useChartDimensions/useChartDimensions.types").UseChartDimensionsState & import("@mui/x-charts/internals/plugins/corePlugins/useChartSeries/useChartSeries.types").UseChartSeriesState<keyof import("@mui/x-charts/internals").ChartsSeriesConfig> & import("@mui/x-charts/internals/plugins/corePlugins/useChartAnimation/useChartAnimation.types").UseChartAnimationState & import("@mui/x-charts/internals").UseChartInteractionListenerState & import("./useChartProZoom.types").UseChartProZoomState & Partial<{}> & {
    cacheKey: import("@mui/x-charts/internals").ChartStateCacheKey;
} & Partial<import("@mui/x-charts/internals").UseChartCartesianAxisState> & {
    cacheKey: import("@mui/x-charts/internals").ChartStateCacheKey;
}, boolean, any[]>;
export declare const selectorChartCanZoomIn: import("reselect").Selector<import("@mui/x-charts/internals/plugins/corePlugins/useChartId/useChartId.types").UseChartIdState & import("@mui/x-charts/internals/plugins/corePlugins/useChartExperimentalFeature/useChartExperimentalFeature.types").UseChartExperimentalFeaturesState & import("@mui/x-charts/internals/plugins/corePlugins/useChartDimensions/useChartDimensions.types").UseChartDimensionsState & import("@mui/x-charts/internals/plugins/corePlugins/useChartSeries/useChartSeries.types").UseChartSeriesState<keyof import("@mui/x-charts/internals").ChartsSeriesConfig> & import("@mui/x-charts/internals/plugins/corePlugins/useChartAnimation/useChartAnimation.types").UseChartAnimationState & import("@mui/x-charts/internals").UseChartInteractionListenerState & import("./useChartProZoom.types").UseChartProZoomState & Partial<{}> & {
    cacheKey: import("@mui/x-charts/internals").ChartStateCacheKey;
} & Partial<import("@mui/x-charts/internals").UseChartCartesianAxisState> & {
    cacheKey: import("@mui/x-charts/internals").ChartStateCacheKey;
}, boolean, any[]>;
