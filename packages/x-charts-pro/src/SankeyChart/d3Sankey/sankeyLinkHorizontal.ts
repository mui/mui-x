import { linkHorizontal, type Link } from '@mui/x-charts-vendor/d3-shape';
import type { SankeyExtraProperties, SankeyLink, SankeyNodeMinimal } from './sankey.types';

function horizontalSource(d: SankeyLink<true, {}, {}>): [number, number] {
  return [(d.source as SankeyNodeMinimal<{}, {}>).x1!, d.y0!];
}

function horizontalTarget(d: SankeyLink<true, {}, {}>): [number, number] {
  return [(d.target as SankeyNodeMinimal<{}, {}>).x0!, d.y1!];
}

/**
 * Get a horizontal link shape suitable for a Sankey diagram.
 * Source and target accessors are pre-configured and work with the
 * default x- and y- accessors of the link shape generator.
 */
export function sankeyLinkHorizontal(): Link<any, SankeyLink<true, {}, {}>, [number, number]>;
/**
 * Get a horizontal link shape suitable for a Sankey diagram.
 * Source and target accessors are pre-configured and work with the
 * default x- and y- accessors of the link shape generator.
 *
 * The first generic N refers to user-defined properties contained in the node data passed into
 * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
 * SankeyNodeMinimal interface.
 *
 * The second generic L refers to user-defined properties contained in the link data passed into
 * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
 * SankeyLinkMinimal interface.
 */
export function sankeyLinkHorizontal<
  N extends SankeyExtraProperties,
  L extends SankeyExtraProperties,
>(): Link<any, SankeyLink<true, N, L>, [number, number]>;
export function sankeyLinkHorizontal() {
  return linkHorizontal<SankeyLink<true, {}, {}>, [number, number]>()
    .source(horizontalSource)
    .target(horizontalTarget);
}
