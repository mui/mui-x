'use client';
import type { ChartDrawingArea } from '@mui/x-charts/hooks';
import { path } from '@mui/x-charts-vendor/d3-path';
import { sankey, type SankeyGraph } from './d3Sankey';
import type {
  SankeyLayout,
  SankeyLayoutLink,
  SankeyLayoutNode,
  DefaultizedSankeySeriesType,
} from './sankey.types';
import { getNodeAlignFunction } from './utils';

/**
 * Calculates the layout for a Sankey diagram using d3-sankey
 *
 * @param data The Sankey data (nodes and links)
 * @param drawingArea The drawing area dimensions
 * @param options Layout configuration options
 * @returns The calculated layout
 */

export function calculateSankeyLayout(
  series: DefaultizedSankeySeriesType,
  drawingArea: ChartDrawingArea,
): SankeyLayout<true> {
  const { data, iterations = 6, nodeOptions, linkOptions } = series;
  const {
    width: nodeWidth = 15,
    padding: nodePadding = 10,
    align: nodeAlign,
    sort: nodeSort,
  } = nodeOptions ?? {};

  const { sort: linkSort, curveCorrection = 10 } = linkOptions ?? {};

  if (!data || !data.links) {
    return { nodes: [], links: [] };
  }

  const { width, height, left, top, bottom, right } = drawingArea;

  // Create the sankey layout generator
  const sankeyGenerator = sankey<typeof data, SankeyLayoutNode<true>, SankeyLayoutLink<true>, true>(
    true,
  )
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .nodeAlign(getNodeAlignFunction(nodeAlign))
    .nodeId((d) => d.id)
    .extent([
      [left, top],
      [width + right, height + bottom],
    ])
    .iterations(iterations);

  // For 'auto' or undefined, don't set anything (use d3-sankey default behavior)
  if (typeof nodeSort === 'function') {
    sankeyGenerator.nodeSort(nodeSort);
  } else if (nodeSort === 'fixed') {
    // Null is not accepted by the types.
    // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/73953
    sankeyGenerator.nodeSort(null as any);
  }
  if (typeof linkSort === 'function') {
    sankeyGenerator.linkSort(linkSort);
  } else if (linkSort === 'fixed') {
    // Null is not accepted by the types.
    sankeyGenerator.linkSort(null as any);
  }

  // Generate the layout
  let result: SankeyGraph<true, SankeyLayoutNode<true>, SankeyLayoutLink<true>>;
  try {
    result = sankeyGenerator(data);
  } catch (error) {
    // There are two errors that can occur:
    // 1. If the data contains circular references, d3-sankey will throw an error.
    // 2. If there are missing source/target nodes, d3-sankey will throw an error.
    // We handle the second case by building a map of nodes ourselves, so they are always present.
    if (error instanceof Error && error.message === 'circular link') {
      throw new Error('MUI X Charts: Sankey diagram contains circular references.');
    }

    throw error;
  }
  const { nodes, links } = result;

  // Convert d3-sankey links to our format
  const layoutLinks = (links as SankeyLayoutLink<true>[]).map((link): SankeyLayoutLink<true> => {
    const rep = {
      ...link,
      path: improvedNaiveSankeyLinkPathHorizontal(link as SankeyLayoutLink<true>, curveCorrection),
    };

    return rep;
  });

  return {
    nodes,
    links: layoutLinks,
  };
}

export function improvedNaiveSankeyLinkPathHorizontal(
  link: SankeyLayoutLink<true>,
  curveCorrection?: number,
) {
  const sx = link.source.x1!;
  const tx = link.target.x0!;
  // Weirdly this seems to work for any chart or node width change
  // But needs to be changed when the sankey height changes.
  const correction = curveCorrection ?? 5;
  const y0 = link.y0!;
  const y1 = link.y1!;
  const w = link.width!;
  const halfW = w / 2;
  const sy0 = y0 - halfW;
  const sy1 = y0 + halfW;
  const ty0 = y1 - halfW;
  const ty1 = y1 + halfW;

  const halfX = (tx - sx) / 2;

  const p = path();
  p.moveTo(sx, sy0);

  const isDecreasing = y0 > y1;
  const direction = isDecreasing ? -1 : 1;

  let cpx1 = sx + halfX + correction * direction;
  let cpy1 = sy0;
  let cpx2 = sx + halfX + correction * direction;
  let cpy2 = ty0;
  p.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, tx, ty0);
  p.lineTo(tx, ty1);

  cpx1 = sx + halfX - correction * direction;
  cpy1 = ty1;
  cpx2 = sx + halfX - correction * direction;
  cpy2 = sy1;
  p.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, sx, sy1);
  p.lineTo(sx, sy0);
  return p.toString();
}
