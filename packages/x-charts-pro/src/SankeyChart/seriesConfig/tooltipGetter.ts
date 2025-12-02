import type { TooltipGetter } from '@mui/x-charts/internals';

export const tooltipGetter: TooltipGetter<'sankey'> = (params) => {
  const { identifier, series } = params;
  if (!identifier) {
    return null;
  }

  const { subType } = identifier;

  if (subType === 'node') {
    const node = identifier.node;

    return {
      identifier,
      color: node.color,
      label: `${node.label}:`,
      value: node.value,
      formattedValue: series.valueFormatter(node.value, {
        type: 'node',
        nodeId: node.id,
        location: 'tooltip',
      }),
      markType: 'square' as const,
    };
  }

  if (subType === 'link') {
    const link = identifier.link;

    if (!link) {
      return null;
    }

    const sourceLabel = link.source.label;
    const targetLabel = link.target.label;

    return {
      identifier,
      color: link.color,
      label: `${sourceLabel} → ${targetLabel}:`,
      value: link.value,
      formattedValue: series.valueFormatter(link.value, {
        type: 'link',
        sourceId: link.source.id,
        targetId: link.target.id,
        location: 'tooltip',
      }),
      markType: 'line' as const,
    };
  }

  return null;
};
