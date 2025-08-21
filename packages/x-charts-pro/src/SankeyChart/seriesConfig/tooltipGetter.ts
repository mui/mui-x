import type { TooltipGetter } from '@mui/x-charts/internals';

export const tooltipGetter: TooltipGetter<'sankey'> = (params) => {
  const { identifier } = params;
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
      formattedValue: `${node.value}`,
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
      formattedValue: `${link.value}`,
      markType: 'line' as const,
    };
  }

  return null;
};
