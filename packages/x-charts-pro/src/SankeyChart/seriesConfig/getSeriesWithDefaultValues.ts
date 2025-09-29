import type { GetSeriesWithDefaultValues } from '@mui/x-charts/internals';
import type { SankeyNodeId, SankeyNode } from '../sankey.types';

const defaultSankeyValueFormatter = (v: number) => (v == null ? '' : v.toLocaleString());

export const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'sankey'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  const nodeMap = new Map<SankeyNodeId, SankeyNode>();
  const nodeColor = seriesData.nodeOptions?.color;
  const data = seriesData.data;

  let colorIndex = -1;

  if (data.nodes) {
    data.nodes.forEach((node) => {
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

  data.links.forEach((v) => {
    if (!nodeMap.has(v.source)) {
      colorIndex += 1;
      const source = {
        id: v.source,
        label: `${v.source}`,
        color: nodeColor ?? colors?.[colorIndex % colors.length],
      };
      nodeMap.set(source.id, source);
    }

    if (!nodeMap.has(v.target)) {
      colorIndex += 1;
      const target = {
        id: v.target,
        label: `${v.target}`,
        color: nodeColor ?? colors?.[colorIndex % colors.length],
      };
      nodeMap.set(target.id, target);
    }
  });

  return {
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    ...seriesData,
    valueFormatter: seriesData.valueFormatter ?? defaultSankeyValueFormatter,
    data: {
      links: data.links,
      nodes: nodeMap,
    },
  };
};
