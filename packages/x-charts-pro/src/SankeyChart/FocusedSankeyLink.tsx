import { useTheme } from '@mui/material/styles';
import { useFocusedItem } from '../hooks';
import { useSankeyLayout } from '../hooks/useSankeySeries';

export function FocusedSankeyLink(props: React.SVGAttributes<SVGPathElement>) {
  const focusedItem = useFocusedItem();
  const layout = useSankeyLayout();
  const theme = useTheme();

  if (!focusedItem || focusedItem.type !== 'sankey' || focusedItem.subType !== 'link' || !layout) {
    return null;
  }

  const link = layout?.links.find(
    ({ source, target }) =>
      source.id === focusedItem.sourceId && target.id === focusedItem.targetId,
  );

  if (!link || !link.path) {
    return null;
  }

  return (
    <path
      d={link.path}
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={2}
      pointerEvents="none"
      {...props}
    />
  );
}
