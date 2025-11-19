'use client';
import { sankey, type SankeyGraph } from '@mui/x-charts-vendor/d3-sankey';
import type { ChartDrawingArea } from '@mui/x-charts/hooks';
import type { Theme } from '@mui/material/styles';
import { path } from '@mui/x-charts-vendor/d3-path';
import type {
  SankeySeriesType,
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
  data: DefaultizedSankeySeriesType['data'],
  drawingArea: ChartDrawingArea,
  theme: Theme,
  series: Pick<SankeySeriesType, 'nodeOptions' | 'linkOptions' | 'iterations'> = {},
): SankeyLayout {
  const { iterations = 6, nodeOptions, linkOptions } = series;
  const {
    width: nodeWidth = 15,
    padding: nodePadding = 10,
    align: nodeAlign = 'justify',
    sort: nodeSort = null,
  } = nodeOptions ?? {};

  const {
    color: linkColor = 'source',
    sort: linkSort = null,
    curveCorrection = 10,
  } = linkOptions ?? {};

  const { width, height, left, top, bottom, right } = drawingArea;
  if (!data || !data.links) {
    return { nodes: [], links: [] };
  }

  // Prepare the data structure expected by d3-sankey
  const graph = {
    nodes: data.nodes
      .values()
      .toArray()
      .map((v) => ({ ...v })),
    links: data.links.map((v) => ({ ...v })),
  };

  // Create the sankey layout generator
  let sankeyGenerator = sankey<typeof graph, SankeyLayoutNode, SankeyLayoutLink>()
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .nodeAlign(getNodeAlignFunction(nodeAlign))
    .extent([
      [left, top],
      [width + right, height + bottom],
    ])
    .nodeId((d) => d.id)
    .iterations(iterations);

  if (nodeSort) {
    sankeyGenerator = sankeyGenerator.nodeSort(nodeSort);
  }
  if (linkSort) {
    sankeyGenerator = sankeyGenerator.linkSort(linkSort);
  }

  // Generate the layout
  let result: SankeyGraph<SankeyLayoutNode, SankeyLayoutLink>;
  try {
    result = sankeyGenerator(graph);
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
  const layoutLinks = (links as SankeyLayoutLink[]).map((link) => {
    // Get the original link data
    const originalLink = data.links.find((l) => {
      return l.source === link.source.id && l.target === link.target.id;
    });

    let resolvedColor = originalLink?.color ?? linkColor;

    if (resolvedColor === 'source') {
      resolvedColor = link.source.color ?? linkColor;
    } else if (resolvedColor === 'target') {
      resolvedColor = link.target.color ?? linkColor;
    }

    return {
      ...originalLink,
      ...link,
      color: resolvedColor,
      path: improvedNaiveSankeyLinkPathHorizontal(link, curveCorrection),
    };
  });

  const layoutNodes = nodes.map((node) => {
    const originalNode = data.nodes.get(node.id) || {};

    return {
      ...originalNode,
      ...node,
    };
  });

  return {
    nodes: layoutNodes,
    links: layoutLinks,
  };
}

export function improvedNaiveSankeyLinkPathHorizontal(
  link: SankeyLayoutLink,
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
