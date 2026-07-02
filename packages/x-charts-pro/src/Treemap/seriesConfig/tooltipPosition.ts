import type { TooltipItemPositionGetter } from '@mui/x-charts/internals';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'treemap'> = (params) => {
  const { seriesLayout, identifier, placement } = params;

  if (!identifier) {
    return null;
  }

  const node = seriesLayout.treemap?.[identifier.seriesId]?.treemapLayout.byId.get(
    identifier.nodeId,
  );
  if (!node) {
    return null;
  }

  const { x0, y0, x1, y1 } = node;

  switch (placement) {
    case 'bottom':
      return { x: (x0 + x1) / 2, y: y1 };
    case 'left':
      return { x: x0, y: (y0 + y1) / 2 };
    case 'right':
      return { x: x1, y: (y0 + y1) / 2 };
    case 'top':
    default:
      return { x: (x0 + x1) / 2, y: y0 };
  }
};

export default tooltipItemPositionGetter;
