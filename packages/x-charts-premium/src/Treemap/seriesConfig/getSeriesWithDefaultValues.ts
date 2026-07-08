import { hierarchy } from '@mui/x-charts-vendor/d3-hierarchy';
import type { HierarchyNode } from '@mui/x-charts-vendor/d3-hierarchy';
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

function normalize(
  node: TreemapSeriesData,
  parentId: TreemapItemId | null,
  indexInParent: number,
): NormalizedTreemapNode {
  const id = node.id ?? (parentId == null ? TREEMAP_ROOT_ID : `${parentId}/${indexInParent}`);
  const label = node.label ?? `${id}`;
  const children = node.children?.map((child, index) => normalize(child, id, index));

  return { ...node, id, label, children };
}

export const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'treemap'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  const rawData = seriesData.data;
  const rootData: TreemapSeriesData = Array.isArray(rawData)
    ? { id: TREEMAP_ROOT_ID, children: rawData }
    : (rawData as TreemapSeriesData);

  const normalizedRoot = normalize(rootData, null, 0);

  const root = hierarchy<NormalizedTreemapNode>(normalizedRoot, (d) => d.children)
    .sum((d) => (d.children && d.children.length ? 0 : (d.value ?? 0)))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

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
      return colors.length === 0 ? '' : (colors[(branchIndex.get(node) ?? 0) % colors.length] ?? '');
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
