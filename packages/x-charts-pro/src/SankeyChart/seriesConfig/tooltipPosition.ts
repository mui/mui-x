import type { TooltipItemPositionGetter } from '@mui/x-charts/internals';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'sankey'> = (params) => {
  const { series, seriesLayout, identifier, placement } = params;

  if (!identifier) {
    return null;
  }

  const seriesItem = series.sankey?.series[identifier.seriesId];
  const layout = seriesLayout.sankey?.[identifier.seriesId]?.sankeyLayout;
  if (seriesItem == null || layout == null) {
    return null;
  }

  if (identifier.subType === 'node') {
    const node = layout.nodes.find((n) => n.id === identifier.nodeId);

    if (!node) {
      return null;
    }

    const { x0 = 0, x1 = 0, y0 = 0, y1 = 0 } = node;

    switch (placement) {
      case 'bottom':
        return { x: (x1 + x0) / 2, y: y1 };
      case 'left':
        return { x: x0, y: (y1 + y0) / 2 };
      case 'right':
        return { x: x1, y: (y1 + y0) / 2 };
      case 'top':
      default:
        return { x: (x1 + x0) / 2, y: y0 };
    }
  }

  if (identifier.subType === 'link') {
    const link = layout.links.find(
      (l) => l.source.id === identifier.sourceId && l.target.id === identifier.targetId,
    );

    if (!link) {
      return null;
    }

    const { y0: yStart = 0, y1: yEnd = 0 } = link;

    const y0 = Math.min(yStart, yEnd) - link.width! / 2;
    const y1 = Math.max(yStart, yEnd) + link.width! / 2;
    const x0 = Math.min(link.source.x1 ?? 0, link.target.x1 ?? 0);
    const x1 = Math.max(link.source.x0 ?? 0, link.target.x0 ?? 0);

    switch (placement) {
      case 'bottom':
        return { x: (x1 + x0) / 2, y: y1 };
      case 'left':
        return { x: x0, y: (y1 + y0) / 2 };
      case 'right':
        return { x: x1, y: (y1 + y0) / 2 };
      case 'top':
      default:
        return { x: (x1 + x0) / 2, y: y0 };
    }
  }

  return null;
};

export default tooltipItemPositionGetter;
