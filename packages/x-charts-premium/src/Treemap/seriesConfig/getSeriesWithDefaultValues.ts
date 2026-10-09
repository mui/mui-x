import { hierarchy } from '@mui/x-charts-vendor/d3-hierarchy';
import type { HierarchyNode } from '@mui/x-charts-vendor/d3-hierarchy';
import { warnOnce } from '@mui/x-internals/warning';
import type { GetSeriesWithDefaultValues } from '@mui/x-charts/internals';
import type { TreemapItemId, TreemapLayoutNode, TreemapSeriesData } from '../treemap.types';
import { TREEMAP_ROOT_ID } from '../utils';

const defaultTreemapValueFormatter = (v: number) => (v == null ? '' : v.toLocaleString());

/** Internal nested representation consumed by d3-hierarchy. */
interface NormalizedTreemapNode {
  id: TreemapItemId;
  label: string;
  value?: number;
  color?: string;
  data?: any;
  children?: NormalizedTreemapNode[];
}

function normalize(node: TreemapSeriesData, parentId: TreemapItemId | null): NormalizedTreemapNode {
  const id = node.id ?? (parentId == null ? TREEMAP_ROOT_ID : `${parentId}/${node.label}`);
  const children = node.children?.map((child) => normalize(child, id));

  return { ...node, id, label: node.label, children };
}

export const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'treemap'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  const rawData = seriesData.data;
  const rootData: TreemapSeriesData = Array.isArray(rawData)
    ? { id: TREEMAP_ROOT_ID, label: '', children: rawData }
    : (rawData as TreemapSeriesData);

  const normalizedRoot = normalize(rootData, null);

  const root = hierarchy<NormalizedTreemapNode>(normalizedRoot, (d) => d.children);

  // A node's value is its explicit `value` when set, otherwise the sum of its children.
  // d3 marks `value` readonly, but it is the field the layout and sort read.
  root.eachAfter((node) => {
    const childrenSum = node.children?.reduce((acc, child) => acc + (child.value ?? 0), 0) ?? 0;
    const explicit = node.data.value;
    if (process.env.NODE_ENV !== 'production' && explicit != null && childrenSum > explicit) {
      warnOnce(
        `MUI X Charts: The treemap node "${node.data.id}" has a value (${explicit}) smaller than the sum of its children (${childrenSum}).\n` +
          `A treemap cannot draw children larger than their parent.\n` +
          `Increase the node value, or omit it to derive it from the children.`,
      );
    }
    (node as { value?: number }).value = explicit ?? childrenSum;
  });

  root.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  // Each top-level (depth 1) branch takes a palette color; descendants inherit their
  // parent's resolved color, so an explicit `color` on any node cascades to its subtree.
  const branchIndex = new Map<HierarchyNode<NormalizedTreemapNode>, number>();
  root.children?.forEach((child, index) => branchIndex.set(child, index));

  const nodes: TreemapLayoutNode<false>[] = [];
  const byId = new Map<TreemapItemId, TreemapLayoutNode<false>>();

  const resolveColor = (node: HierarchyNode<NormalizedTreemapNode>): string => {
    if (node.data.color) {
      return node.data.color;
    }
    if (node.depth === 1) {
      return colors.length === 0
        ? ''
        : (colors[(branchIndex.get(node) ?? 0) % colors.length] ?? '');
    }
    // Inherit the parent's already-resolved color (nodes are visited parent-first).
    const parentId = node.parent?.data.id;
    return (parentId != null ? byId.get(parentId)?.color : undefined) ?? colors[0] ?? '';
  };

  root.eachBefore((node) => {
    const flat: TreemapLayoutNode<false> = {
      id: node.data.id,
      label: node.data.label,
      color: resolveColor(node),
      value: node.value ?? 0,
      depth: node.depth,
      height: node.height,
      parentId: node.parent?.data.id ?? null,
      childrenIds: node.children?.map((child) => child.data.id) ?? [],
      data: node.data.data,
    };
    nodes.push(flat);
    byId.set(flat.id, flat);
  });

  return {
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    valueFormatter: seriesData.valueFormatter ?? defaultTreemapValueFormatter,
    highlightScope: { highlight: 'none', fade: 'none' },
    data: { nodes, byId, rootId: normalizedRoot.id },
  };
};
