import type { GetSeriesWithDefaultValues } from '@mui/x-charts/internals';
import type { SankeyNodeId, SankeyNode, SankeyLayoutLink, SankeyLayoutNode } from '../sankey.types';
import { sankey, type SankeyGraph } from '../d3Sankey';
import { getNodeAlignFunction } from '../utils';

const defaultSankeyValueFormatter = (v: number) => (v == null ? '' : v.toLocaleString());

export const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'sankey'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  const nodeMap = new Map<SankeyNodeId, SankeyNode>();
  const nodeColor = seriesData.nodeOptions?.color;
  const nodeAlign = seriesData.nodeOptions?.align;

  const { color: linkColor = 'source' } = seriesData.linkOptions ?? {};

  let colorIndex = -1;
  if (seriesData.data.nodes) {
    seriesData.data.nodes.forEach((node) => {
      const id = node.id || node.label || '';
      const label = node.label || `${id}`;
      colorIndex += 1;
      nodeMap.set(id, {
        ...node,
        id,
        label,
        color: node.color ?? nodeColor ?? colors?.[colorIndex % colors.length],
      });
    });
  }

  const links = seriesData.data.links.map((link) => {
    // Add default values to nodes
    if (!nodeMap.has(link.source)) {
      colorIndex += 1;
      const source = {
        id: link.source,
        label: `${link.source}`,
        color: nodeColor ?? colors?.[colorIndex % colors.length],
      };
      nodeMap.set(source.id, source);
    }

    if (!nodeMap.has(link.target)) {
      colorIndex += 1;
      const target = {
        id: link.target,
        label: `${link.target}`,
        color: nodeColor ?? colors?.[colorIndex % colors.length],
      };
      nodeMap.set(target.id, target);
    }

    // Add color to links
    let resolvedColor = link.color ?? linkColor;

    if (resolvedColor === 'source') {
      resolvedColor = nodeMap.get(link.source)?.color ?? linkColor;
    } else if (resolvedColor === 'target') {
      resolvedColor = nodeMap.get(link.target)?.color ?? linkColor;
    }

    return { ...link, color: resolvedColor };
  });

  if (!seriesData.data || !links) {
    return {
      id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
      ...seriesData,
      valueFormatter: seriesData.valueFormatter ?? defaultSankeyValueFormatter,
      data: { nodes: [], links: [] },
    };
  }

  //  Prepare the data structure expected by d3-sankey
  const graph = {
    nodes: nodeMap
      .values()
      .toArray()
      .map((v) => ({ ...v })),
    links: links.map((v) => ({ ...v })),
  };

  // Create the sankey layout generator
  const sankeyGenerator = sankey<
    typeof graph,
    SankeyLayoutNode<false>,
    SankeyLayoutLink<false>,
    false
  >(false)
    .nodeAlign(getNodeAlignFunction(nodeAlign))
    .nodeId((d) => d.id);

  // Generate the layout
  let data: SankeyGraph<false, SankeyLayoutNode<false>, SankeyLayoutLink<false>>;
  try {
    data = sankeyGenerator(graph);
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

  return {
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    ...seriesData,
    valueFormatter: seriesData.valueFormatter ?? defaultSankeyValueFormatter,
    data,
  };
};
