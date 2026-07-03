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

  return { id, label, value: node.value, color: node.color, data: node.data, children };
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

  let root = hierarchy<NormalizedTreemapNode>(normalizedRoot, (d) => d.children).sum((d) =>
    d.children && d.children.length ? 0 : (d.value ?? 0),
  );

  root = root.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  // A node takes the palette color of its top-level (depth 1) ancestor, so a subtree
  // shares one color. An explicit `color` on the data node wins.
  const branchIndex = new Map<HierarchyNode<NormalizedTreemapNode>, number>();
  root.children?.forEach((child, index) => branchIndex.set(child, index));

  const resolveColor = (node: HierarchyNode<NormalizedTreemapNode>): string => {
    if (node.data.color) {
      return node.data.color;
    }
    let branch: HierarchyNode<NormalizedTreemapNode> | undefined;
    if (node.depth === 1) {
      branch = node;
    } else if (node.depth > 1) {
      branch = node.ancestors().find((ancestor) => ancestor.depth === 1);
    }
    if (!branch || colors.length === 0) {
      return colors[0] ?? '';
    }
    return colors[(branchIndex.get(branch) ?? 0) % colors.length] ?? '';
  };

  const nodes: TreemapLayoutNode<false>[] = [];
  const byId = new Map<TreemapItemId, TreemapLayoutNode<false>>();
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
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    ...seriesData,
    valueFormatter: seriesData.valueFormatter ?? defaultTreemapValueFormatter,
    highlightScope: { highlight: 'none', fade: 'none' },
    data: { nodes, byId, rootId: normalizedRoot.id },
  };
};
