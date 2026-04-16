import {
    useChartZAxis,
    type UseChartZAxisSignature,
    useChartPolarAxis,
    type UseChartPolarAxisSignature,
    useChartTooltip,
    type UseChartTooltipSignature,
    useChartInteraction,
    type UseChartInteractionSignature,
    useChartHighlight,
    type UseChartHighlightSignature,
    useChartKeyboardNavigation,
    type UseChartKeyboardNavigationSignature,
    useChartVisibilityManager,
    type UseChartVisibilityManagerSignature,

    type ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';

export type RadialLineChartPluginSignatures = [
    UseChartZAxisSignature,
    UseChartTooltipSignature<'radialLine'>,
    UseChartInteractionSignature,
    UseChartPolarAxisSignature<'radialLine'>,
    UseChartHighlightSignature<'radialLine'>,
    UseChartVisibilityManagerSignature<'radialLine'>,
    UseChartKeyboardNavigationSignature,
];

export const RADIAL_LINE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<RadialLineChartPluginSignatures> = [
    useChartZAxis,
    useChartTooltip,
    useChartInteraction,
    useChartPolarAxis,
    useChartHighlight,
    useChartVisibilityManager,
    useChartKeyboardNavigation,
];