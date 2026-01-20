import { useTheme } from '@mui/material/styles';
import { useFocusedItem } from '../hooks';
import { useSankeyLayout } from '../hooks/useSankeySeries';

export function FocusedSankeyNode(props: React.SVGAttributes<SVGRectElement>) {
  const focusedItem = useFocusedItem();
  const layout = useSankeyLayout();
  const theme = useTheme();

  if (!focusedItem || focusedItem.type !== 'sankey' || focusedItem.subType !== 'node' || !layout) {
    return null;
  }
  const node = layout?.nodes.find(({ id }) => id === focusedItem.nodeId);

  if (!node) {
    return null;
  }

  const x0 = node.x0 ?? 0;
  const y0 = node.y0 ?? 0;
  const x1 = node.x1 ?? 0;
  const y1 = node.y1 ?? 0;

  return (
    <rect
      x={x0}
      y={y0}
      width={x1 - x0}
      height={y1 - y0}
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={2}
      pointerEvents="none"
      {...props}
    />
  );
}
