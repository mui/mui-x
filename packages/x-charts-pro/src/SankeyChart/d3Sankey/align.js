import { min } from '@mui/x-charts-vendor/d3-array';

function targetDepth(d) {
  return d.target.depth;
}

export function left(node) {
  return node.depth;
}

export function right(node, n) {
  return n - 1 - node.height;
}

export function justify(node, n) {
  return node.sourceLinks.length ? node.depth : n - 1;
}

export function center(node) {
  // eslint-disable-next-line no-nested-ternary
  return node.targetLinks.length
    ? node.depth
    : node.sourceLinks.length
      ? min(node.sourceLinks, targetDepth) - 1
      : 0;
}
