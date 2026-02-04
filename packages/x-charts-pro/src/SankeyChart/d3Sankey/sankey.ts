/* eslint-disable */
import { max, min, sum } from '@mui/x-charts-vendor/d3-array';
import { sankeyJustify } from './align';
import type {
  SankeyExtraProperties,
  SankeyGraph,
  SankeyLayout,
  SankeyLink,
  SankeyLinkMinimal,
  SankeyNode,
  SankeyNodeMinimal,
} from './sankey.types';

// Helper types for internal use within the Sankey layout generator.

type CompleteLink<WithPosition extends boolean> = Omit<
  Required<SankeyLink<WithPosition, {}, {}>>,
  'source' | 'target'
> & {
  source: CompleteNode<WithPosition>;
  target: CompleteNode<WithPosition>;
};

type CompleteNode<WithPosition extends boolean> = Omit<
  Required<SankeyNode<WithPosition, {}, {}>>,
  'sourceLinks' | 'targetLinks'
> & {
  sourceLinks: CompleteLink<WithPosition>[];
  targetLinks: CompleteLink<WithPosition>[];
};

type CompleteGraph<WithPosition extends boolean> = {
  nodes: CompleteNode<WithPosition>[];
  links: CompleteLink<WithPosition>[];
};

function constant<T>(x: T) {
  return function () {
    return x;
  };
}

function ascendingSourceBreadth(a: CompleteLink<true>, b: CompleteLink<true>) {
  return ascendingBreadth(a.source, b.source) || a.index - b.index;
}

function ascendingTargetBreadth(a: CompleteLink<true>, b: CompleteLink<true>) {
  return ascendingBreadth(a.target, b.target) || a.index - b.index;
}

function ascendingBreadth(a: CompleteNode<true>, b: CompleteNode<true>) {
  return a.y0 - b.y0;
}

function value<WithPosition extends boolean>(
  d: CompleteLink<WithPosition> | CompleteNode<WithPosition>,
) {
  return d.value;
}

function defaultId(d: any, e: any, f: any) {
  return d.index;
}

function defaultNodes<WithPosition extends boolean>(graph: SankeyGraph<WithPosition, {}, {}>) {
  return graph.nodes;
}

function defaultLinks<WithPosition extends boolean>(graph: SankeyGraph<WithPosition, {}, {}>) {
  return graph.links;
}

function find(nodeById: Map<any, SankeyNodeMinimal<{}, {}>>, id: string | number) {
  const node = nodeById.get(id);
  if (!node) {
    throw new Error('missing: ' + id);
  }
  return node;
}

function computeLinkBreadths({ nodes }: CompleteGraph<true>) {
  for (const node of nodes) {
    let y0 = node.y0;
    let y1 = y0;
    for (const link of node.sourceLinks) {
      link.y0 = y0 + link.width / 2;
      y0 += link.width;
    }
    for (const link of node.targetLinks) {
      link.y1 = y1 + link.width / 2;
      y1 += link.width;
    }
  }
}

/**
 * Get a Sankey layout generator.
 *
 * Invoking sankey() without generics, means the node type and link type assume no user-defined attributes, i.e.
 * only the attributes internally used by the Sankey layout generator.
 *
 * Default nodes/links accessors are assumed.
 */
export function sankey<WithPosition extends boolean>(
  withoutPositions?: WithPosition,
): SankeyLayout<WithPosition, SankeyGraph<WithPosition, {}, {}>, {}, {}>;
/**
 * Get a Sankey layout generator.
 *
 * Default nodes/links accessors are assumed.
 *
 * The first generic N refers to user-defined properties contained in the node data passed into
 * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
 * SankeyNodeMinimal interface.
 *
 * The second generic L refers to user-defined properties contained in the link data passed into
 * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
 * SankeyLinkMinimal interface.
 */
export function sankey<
  N extends SankeyExtraProperties,
  L extends SankeyExtraProperties,
  WithPosition extends boolean,
>(
  withoutPositions?: WithPosition,
): SankeyLayout<WithPosition, SankeyGraph<WithPosition, N, L>, N, L>;
/**
 * Get a Sankey layout generator.
 *
 * The nodes/links accessors need to be configured to work with the data type of the first argument passed
 * in when invoking the Sankey layout generator.
 *
 * The first generic corresponds to the data type of the first argument passed in when invoking the Sankey layout generator,
 * and its nodes/links accessors.
 *
 * The second generic N refers to user-defined properties contained in the node data passed into
 * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
 * SankeyNodeMinimal interface.
 *
 * The third generic L refers to user-defined properties contained in the link data passed into
 * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
 * SankeyLinkMinimal interface.
 */
export function sankey<
  Data,
  N extends SankeyExtraProperties,
  L extends SankeyExtraProperties,
  WithPosition extends boolean,
>(withPositions?: WithPosition): SankeyLayout<WithPosition, Data, N, L>;
export function sankey<
  Data,
  N extends SankeyExtraProperties,
  L extends SankeyExtraProperties,
  WithPosition extends boolean,
>(withPositions?: WithPosition): SankeyLayout<WithPosition, Data, N, L> {
  let x0 = 0,
    y0 = 0,
    x1 = 1,
    y1 = 1; // extent
  let dx = 24; // nodeWidth
  let dy = 8,
    py: number; // nodePadding
  let id = defaultId;
  let align = sankeyJustify;
  let sort: undefined;
  let linkSort:
    | ((a: SankeyLinkMinimal<{}, {}>, b: SankeyLinkMinimal<{}, {}>) => number)
    | null
    | undefined;
  let nodes = defaultNodes;
  let links = defaultLinks;
  let iterations = 6;

  function sankey() {
    const graph = {
      nodes: nodes.apply(null, arguments as any),
      links: links.apply(null, arguments as any),
      // It is not really complete at this point, but will mostly be once
      // computeNodeLinks(graph) is called.
    } as CompleteGraph<WithPosition>;
    computeNodeLinks(graph);
    computeNodeValues(graph);
    computeNodeDepths(graph);
    computeNodeHeights(graph);
    computeNodeLayers(graph);

    if (!withPositions) {
      return graph;
    }

    computeNodeBreadths(graph);
    computeLinkBreadths(graph);
    return graph;
  }

  sankey.update = function (graph: CompleteGraph<WithPosition>) {
    computeLinkBreadths(graph);
    return graph;
  };

  sankey.nodeId = function (_: (d: any, e: any, f: any) => any) {
    return arguments.length ? ((id = typeof _ === 'function' ? _ : constant(_)), sankey) : id;
  };

  sankey.nodeAlign = function (_: (node: SankeyNode<WithPosition, {}, {}>, n: number) => number) {
    return arguments.length ? ((align = typeof _ === 'function' ? _ : constant(_)), sankey) : align;
  };

  sankey.nodeSort = function (_: any) {
    return arguments.length ? ((sort = _), sankey) : sort;
  };

  sankey.nodeWidth = function (_: string | number) {
    return arguments.length ? ((dx = +_), sankey) : dx;
  };

  sankey.nodePadding = function (_: string | number) {
    return arguments.length ? ((dy = py = +_), sankey) : dy;
  };

  sankey.nodes = function (
    _: (graph: SankeyGraph<WithPosition, {}, {}>) => SankeyNodeMinimal<{}, {}>[],
  ) {
    return arguments.length ? ((nodes = typeof _ === 'function' ? _ : constant(_)), sankey) : nodes;
  };

  sankey.links = function (
    _: (graph: SankeyGraph<WithPosition, {}, {}>) => SankeyLinkMinimal<{}, {}>[],
  ) {
    return arguments.length ? ((links = typeof _ === 'function' ? _ : constant(_)), sankey) : links;
  };

  sankey.linkSort = function (_: any) {
    return arguments.length ? ((linkSort = _), sankey) : linkSort;
  };

  sankey.size = function (_: (string | number)[]) {
    return arguments.length
      ? ((x0 = y0 = 0), (x1 = +_[0]), (y1 = +_[1]), sankey)
      : [x1 - x0, y1 - y0];
  };

  sankey.extent = function (_: (string | number)[][]) {
    return arguments.length
      ? ((x0 = +_[0][0]), (x1 = +_[1][0]), (y0 = +_[0][1]), (y1 = +_[1][1]), sankey)
      : [
          [x0, y0],
          [x1, y1],
        ];
  };

  sankey.iterations = function (_: string | number) {
    return arguments.length ? ((iterations = +_), sankey) : iterations;
  };

  function computeNodeLinks({ nodes, links }: SankeyGraph<WithPosition, {}, {}>) {
    for (const [i, node] of nodes.entries()) {
      node.index = i;
      node.sourceLinks = [];
      node.targetLinks = [];
    }
    const nodeById = new Map(nodes.map((d, i) => [id(d, i, nodes), d]));
    for (const [i, link] of links.entries()) {
      link.index = i;
      let { source, target } = link;
      if (typeof source !== 'object') source = link.source = find(nodeById, source);
      if (typeof target !== 'object') target = link.target = find(nodeById, target);
      source.sourceLinks!.push(link);
      target.targetLinks!.push(link);
    }
    if (linkSort != null) {
      for (const { sourceLinks, targetLinks } of nodes) {
        sourceLinks!.sort(linkSort);
        targetLinks!.sort(linkSort);
      }
    }
  }

  function computeNodeValues({ nodes }: CompleteGraph<WithPosition>) {
    for (const node of nodes) {
      node.value =
        node.fixedValue === undefined
          ? Math.max(sum(node.sourceLinks, value), sum(node.targetLinks, value))
          : node.fixedValue;
    }
  }

  function computeNodeDepths({ nodes }: CompleteGraph<WithPosition>) {
    const n = nodes.length;
    let current = new Set<CompleteNode<WithPosition>>(nodes);
    let next = new Set<CompleteNode<WithPosition>>();
    let x = 0;
    while (current.size) {
      for (const node of current) {
        node.depth = x;
        for (const { target } of node.sourceLinks) {
          next.add(target);
        }
      }
      if (++x > n) throw new Error('circular link');
      current = next;
      next = new Set();
    }
  }

  function computeNodeHeights({ nodes }: CompleteGraph<WithPosition>) {
    const n = nodes.length;
    let current = new Set<CompleteNode<WithPosition>>(nodes);
    let next = new Set<CompleteNode<WithPosition>>();
    let x = 0;
    while (current.size) {
      for (const node of current) {
        node.height = x;
        for (const { source } of node.targetLinks) {
          next.add(source);
        }
      }
      if (++x > n) throw new Error('circular link');
      current = next;
      next = new Set();
    }
  }

  function computeNodeLayers({ nodes }: CompleteGraph<true>) {
    const x = (max(nodes, (d) => d.depth) ?? 0) + 1;
    const kx = (x1 - x0 - dx) / (x - 1);
    const columns = new Array<CompleteNode<true>[]>(x);
    for (const node of nodes) {
      const i = Math.max(0, Math.min(x - 1, Math.floor(align.call(null, node, x))));
      node.layer = i;
      node.x0 = x0 + i * kx;
      node.x1 = node.x0 + dx;
      if (columns[i]) columns[i].push(node);
      else columns[i] = [node];
    }
    if (sort)
      for (const column of columns) {
        column.sort(sort);
      }
    return columns;
  }

  function initializeNodeBreadths(columns: CompleteNode<true>[][]) {
    const ky = min(columns, (c) => (y1 - y0 - (c.length - 1) * py) / sum(c, value));
    for (const nodes of columns) {
      let y = y0;
      for (const node of nodes) {
        node.y0 = y;
        node.y1 = y + node.value * ky!;
        y = node.y1 + py;
        for (const link of node.sourceLinks) {
          link.width = link.value * ky!;
        }
      }
      y = (y1 - y + py) / (nodes.length + 1);
      for (let i = 0; i < nodes.length; ++i) {
        const node = nodes[i];
        node.y0 += y * (i + 1);
        node.y1 += y * (i + 1);
      }
      reorderLinks(nodes);
    }
  }

  function computeNodeBreadths(graph: CompleteGraph<true>) {
    const columns = computeNodeLayers(graph);
    py = Math.min(dy, (y1 - y0) / (max(columns, (c) => c.length)! - 1));
    initializeNodeBreadths(columns);
    for (let i = 0; i < iterations; ++i) {
      const alpha = Math.pow(0.99, i);
      const beta = Math.max(1 - alpha, (i + 1) / iterations);
      relaxRightToLeft(columns, alpha, beta);
      relaxLeftToRight(columns, alpha, beta);
    }
  }

  // Reposition each node based on its incoming (target) links.
  function relaxLeftToRight(columns: CompleteNode<true>[][], alpha: number, beta: number) {
    for (let i = 1, n = columns.length; i < n; ++i) {
      const column = columns[i];
      for (const target of column) {
        let y = 0;
        let w = 0;
        for (const { source, value } of target.targetLinks) {
          let v = value * (target.layer - source.layer);
          y += targetTop(source, target) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        let dy = (y / w - target.y0) * alpha;
        target.y0 += dy;
        target.y1 += dy;
        reorderNodeLinks(target);
      }
      if (sort === undefined) column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  }

  // Reposition each node based on its outgoing (source) links.
  function relaxRightToLeft(columns: CompleteNode<true>[][], alpha: number, beta: number) {
    for (let n = columns.length, i = n - 2; i >= 0; --i) {
      const column = columns[i];
      for (const source of column) {
        let y = 0;
        let w = 0;
        for (const { target, value } of source.sourceLinks) {
          let v = value * (target.layer - source.layer);
          y += sourceTop(source, target) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        let dy = (y / w - source.y0) * alpha;
        source.y0 += dy;
        source.y1 += dy;
        reorderNodeLinks(source);
      }
      if (sort === undefined) column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  }

  function resolveCollisions(nodes: CompleteNode<true>[], alpha: number) {
    const i = nodes.length >> 1;
    const subject = nodes[i];
    resolveCollisionsBottomToTop(nodes, subject.y0 - py, i - 1, alpha);
    resolveCollisionsTopToBottom(nodes, subject.y1 + py, i + 1, alpha);
    resolveCollisionsBottomToTop(nodes, y1, nodes.length - 1, alpha);
    resolveCollisionsTopToBottom(nodes, y0, 0, alpha);
  }

  // Push any overlapping nodes down.
  function resolveCollisionsTopToBottom(
    nodes: CompleteNode<true>[],
    y: number,
    i: number,
    alpha: number,
  ) {
    for (; i < nodes.length; ++i) {
      const node = nodes[i];
      const dy = (y - node.y0) * alpha;
      if (dy > 1e-6) ((node.y0 += dy), (node.y1 += dy));
      y = node.y1 + py;
    }
  }

  // Push any overlapping nodes up.
  function resolveCollisionsBottomToTop(
    nodes: CompleteNode<true>[],
    y: number,
    i: number,
    alpha: number,
  ) {
    for (; i >= 0; --i) {
      const node = nodes[i];
      const dy = (node.y1 - y) * alpha;
      if (dy > 1e-6) ((node.y0 -= dy), (node.y1 -= dy));
      y = node.y0 - py;
    }
  }

  function reorderNodeLinks({ sourceLinks, targetLinks }: CompleteNode<true>) {
    if (linkSort === undefined) {
      for (const {
        source: { sourceLinks },
      } of targetLinks) {
        sourceLinks.sort(ascendingTargetBreadth);
      }
      for (const {
        target: { targetLinks },
      } of sourceLinks) {
        targetLinks.sort(ascendingSourceBreadth);
      }
    }
  }

  function reorderLinks(nodes: CompleteNode<true>[]) {
    if (linkSort === undefined) {
      for (const { sourceLinks, targetLinks } of nodes) {
        sourceLinks?.sort(ascendingTargetBreadth);
        targetLinks?.sort(ascendingSourceBreadth);
      }
    }
  }

  // Returns the target.y0 that would produce an ideal link from source to target.
  function targetTop(source: CompleteNode<true>, target: CompleteNode<true>) {
    let y = source.y0 - ((source.sourceLinks.length - 1) * py) / 2;
    for (const { target: node, width } of source.sourceLinks) {
      if (node === target) break;
      y += width + py;
    }
    for (const { source: node, width } of target.targetLinks) {
      if (node === source) break;
      y -= width;
    }
    return y;
  }

  // Returns the source.y0 that would produce an ideal link from source to target.
  function sourceTop(source: CompleteNode<true>, target: CompleteNode<true>) {
    let y = target.y0 - ((target.targetLinks.length - 1) * py) / 2;
    for (const { source: node, width } of target.targetLinks) {
      if (node === source) break;
      y += width + py;
    }
    for (const { target: node, width } of source.sourceLinks) {
      if (node === target) break;
      y -= width;
    }
    return y;
  }

  return sankey as any as SankeyLayout<WithPosition, Data, N, L>;
}
