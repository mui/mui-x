import type { TooltipGetter } from '@mui/x-charts/internals';

export const tooltipGetter: TooltipGetter<'treemap'> = (params) => {
  const { identifier, series } = params;
  if (!identifier) {
    return null;
  }

  const node = series.data.byId.get(identifier.nodeId);
  if (!node) {
    return null;
  }

  return {
    identifier,
    color: node.color,
    label: `${node.label}:`,
    value: node.value,
    formattedValue: series.valueFormatter(node.value, {
      location: 'tooltip',
      nodeId: node.id,
      depth: node.depth,
    }),
    markType: 'square' as const,
  };
};
