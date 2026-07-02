import { hierarchy } from '@mui/x-charts-vendor/d3-hierarchy';
import type { HierarchyNode } from '@mui/x-charts-vendor/d3-hierarchy';
import { hsl } from '@mui/x-charts-vendor/d3-color';
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

  const sort = seriesData.tiling?.sort ?? 'auto';
  if (sort !== 'fixed') {
    root = root.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  }

  // A node inherits the palette hue of its top-level (depth 1) ancestor so that
  // a subtree shares a hue. An explicit `color` on the data node wins.
  const branchIndex = new Map<HierarchyNode<NormalizedTreemapNode>, number>();
  root.children?.forEach((child, index) => branchIndex.set(child, index));

  // In multi-level treemaps the fill lightness is driven by the node's level:
  // the middle level keeps the base hue, shallower levels (painted behind) are
  // darker, and deeper levels (painted in front) are lighter. `root.height` is
  // the deepest rendered level (rendered depths are 1..maxDepth).
  // The lightness deviates by at most LIGHTNESS_SPREAD / 2 at the shallowest and
  // deepest levels, regardless of how many levels there are.
  const LIGHTNESS_SPREAD = 0.36;
  const maxDepth = root.height;
  const middleDepth = (1 + maxDepth) / 2;
  const lightnessStep = maxDepth > 1 ? LIGHTNESS_SPREAD / (maxDepth - 1) : 0;

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
    const base = colors[(branchIndex.get(branch) ?? 0) % colors.length] ?? '';
    if (!base || lightnessStep === 0) {
      return base;
    }
    const shaded = hsl(base);
    if (Number.isNaN(shaded.l)) {
      return base;
    }
    shaded.l = Math.min(1, Math.max(0, shaded.l + (node.depth - middleDepth) * lightnessStep));
    return shaded.formatHex();
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
    highlightScope: {
      highlight: seriesData.nodeOptions?.highlight ?? 'item',
      fade: seriesData.nodeOptions?.fade ?? 'none',
    },
    data: { nodes, byId, rootId: normalizedRoot.id },
  };
};
