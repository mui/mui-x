'use client';
import { sankey, type SankeyGraph } from '@mui/x-charts-vendor/d3-sankey';
import type { ChartDrawingArea } from '@mui/x-charts/hooks';
import type { Theme } from '@mui/material/styles';
import { path } from '@mui/x-charts-vendor/d3-path';
import type {
  SankeySeriesType,
  SankeyLayout,
  SankeyNode,
  SankeyLink,
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
  const { iterations = 32, nodeOptions, linkOptions } = series;
  const {
    width: nodeWidth = 15,
    padding: nodePadding = 10,
    align: nodeAlign = 'justify',
    sort: nodeSort = null,
  } = nodeOptions ?? {};

  const { color: linkColor = theme.palette.text.primary, sort: linkSort = null } =
    linkOptions ?? {};

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
  let result: SankeyGraph<SankeyNode, Omit<SankeyLink, 'source' | 'target'>>;
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
  // Cast to SankeyLayoutLink as it has the correct properties
  const layoutLinks: SankeyLayoutLink[] = (links as SankeyLayoutLink[]).map((link) => {
    // Get the original link data
    const originalLink = data.links.find((l) => {
      return l.source === link.source.id && l.target === link.target.id;
    });

    return {
      color: linkColor,
      ...originalLink,
      ...link,
      path: sankeyLinkPath(link),
    };
  });

  const layoutNodes: SankeyLayoutNode[] = nodes.map((node) => {
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

function sankeyLinkPath(link: SankeyLayoutLink): string {
  /**
   * This function is a drop in replacement for d3.sankeyLinkHorizontal().
   * Except any accessors/options.
   */
  // Min and max X of the link
  const x0 = link.source.x1 ?? 0;
  const x1 = link.target.x0 ?? 0;
  // Max and min Y of the link
  const y0 = link.y0 ?? 0;
  const y1 = link.y1 ?? 0;
  const halfW = (link.width ?? 0) / 2;

  // Center (x) of the link
  const lcx = (x0 + x1) / 2;

  // Define outline of link as path
  const ctx = path();

  const pathPoints: Point[] = [];

  const N = 10;
  // Creates N points over the line for better interpolation
  // We use 100 to prevent rounding errors
  for (let i = 0; i <= 100; i += 100 / N) {
    const p = cubic(
      i / 100,
      // Start point, source node
      { x: x0, y: y0 },
      // Control points at the center
      { x: lcx, y: y0 },
      { x: lcx, y: y1 },
      // Control point 2 at the center
      { x: x1, y: y1 },
    );
    pathPoints.push(p);
  }

  const angles = pathPoints.map((v, i) =>
    i === 0 || i === pathPoints.length - 1 ? 0 : getLineAngleRadians(pathPoints[i - 1], v),
  );

  const topPoints = pathPoints.map((v, i) => movePoint(v, angles[i], halfW, 90));
  const bottomPoints = pathPoints.map((v, i) => movePoint(v, angles[i], halfW, -90)).reverse();

  // We add the last point again to close the curve
  topPoints.push(movePoint(pathPoints.at(-1)!, 0, halfW, 90));
  bottomPoints.push(movePoint(pathPoints.at(0)!, 0, halfW, -90));

  const topCurves = catmullRom2bezier(topPoints);
  const bottomCurves = catmullRom2bezier(bottomPoints);

  ctx.moveTo(topPoints[0].x, topPoints[0].y);
  for (let i = 0; i < topCurves.length; i += 1) {
    ctx.bezierCurveTo(...topCurves[i]);
  }
  ctx.lineTo(bottomPoints[0].x, bottomPoints[0].y);
  for (let i = 0; i < bottomCurves.length; i += 1) {
    ctx.bezierCurveTo(...bottomCurves[i]);
  }
  ctx.lineTo(topPoints[0].x, topPoints[0].y);

  return ctx.toString();
}

type Point = {
  x: number;
  y: number;
};

function lerp(val: number, p1: Point, p2: Point) {
  const x = p1.x + (p2.x - p1.x) * val;
  const y = p1.y + (p2.y - p1.y) * val;
  return { x, y };
}

function quadratic(val: number, p1: Point, c1: Point, p2: Point) {
  const x = lerp(val, p1, c1);
  const y = lerp(val, c1, p2);
  const l = lerp(val, x, y);
  return { x: l.x, y: l.y };
}

function cubic(val: number, p1: Point, c1: Point, c2: Point, p2: Point) {
  const x = quadratic(val, p1, c1, c2);
  const y = quadratic(val, c1, c2, p2);

  const l = lerp(val, x, y);
  return { x: l.x, y: l.y };
}

function getLineAngleRadians(p1?: Point, p2?: Point) {
  if (!p1 || !p2) {
    return 0; // Default angle if points are not defined
  }

  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function movePoint(
  point: Point,
  angleRadians: number,
  distance: number,
  changeAngle: number,
): Point {
  const radians = angleRadians + (changeAngle * Math.PI) / 180;

  // Calculate the change in x and y coordinates
  const deltaX = distance * Math.cos(radians);
  const deltaY = distance * Math.sin(radians);

  // Calculate the new coordinates
  const newX = point.x + deltaX;
  const newY = point.y + deltaY;

  return { x: newX, y: newY };
}

function catmullRom2bezier(points: Point[]) {
  const quadraticArguments: [number, number, number, number, number, number][] = [];
  for (let i = 0; points.length - 2 > i; i += 1) {
    const p: Point[] = [];
    if (i === 0) {
      p.push({ x: points[i].x, y: points[i].y });
      p.push({ x: points[i].x, y: points[i].y });
      p.push({ x: points[i + 1].x, y: points[i + 1].y });
      p.push({ x: points[i + 2].x, y: points[i + 2].y });
    } else if (points.length - 2 === i) {
      p.push({ x: points[i - 1].x, y: points[i - 1].y });
      p.push({ x: points[i].x, y: points[i].y });
      p.push({ x: points[i + 1].x, y: points[i + 1].y });
      p.push({ x: points[i + 2].x, y: points[i + 2].y });
    } else {
      p.push({ x: points[i - 1].x, y: points[i - 1].y });
      p.push({ x: points[i].x, y: points[i].y });
      p.push({ x: points[i + 1].x, y: points[i + 1].y });
      p.push({ x: points[i + 2].x, y: points[i + 2].y });
    }

    // Catmull-Rom to Cubic Bezier conversion matrix
    //    0       1       0       0
    //  -1/6      1      1/6      0
    //    0      1/6      1     -1/6
    //    0       0       1       0

    const bp: Point[] = [];
    bp.push({ x: p[1].x, y: p[1].y });
    bp.push({ x: (-p[0].x + 6 * p[1].x + p[2].x) / 6, y: (-p[0].y + 6 * p[1].y + p[2].y) / 6 });
    bp.push({ x: (p[1].x + 6 * p[2].x - p[3].x) / 6, y: (p[1].y + 6 * p[2].y - p[3].y) / 6 });
    bp.push({ x: p[2].x, y: p[2].y });

    quadraticArguments.push([bp[1].x, bp[1].y, bp[2].x, bp[2].y, bp[3].x, bp[3].y]);
  }

  return quadraticArguments;
}
