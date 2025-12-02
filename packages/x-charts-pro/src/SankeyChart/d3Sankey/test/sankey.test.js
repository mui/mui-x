import { sankey } from '../sankey';
import energyData from './energy.json';
import energyNodes from './energy-nodes.json';
import energyLinks from './energy-links.json';

describe('scalePoint', () => {
  it('sankey(energy) returns the expected results', () => {
    const sankeyGenerator = sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([
          [1, 1],
          [959, 494],
        ]),
      energy = sankeyGenerator(energyData);
    expect(energy.nodes.map(nodePosition)).toEqual(energyNodes);
    expect(energy.links.map(linkPosition)).toEqual(energyLinks);
  });
});

function nodePosition(node) {
  return {
    x: round(node.x0),
    dx: round(node.x1 - node.x0),
    y: round(node.y0),
    dy: round(node.y1 - node.y0),
  };
}

function linkPosition(link) {
  return {
    source: nodePosition(link.source),
    target: nodePosition(link.target),
    dy: round(link.width),
    sy: round(link.y0 - link.source.y0 - link.width / 2),
    ty: round(link.y1 - link.target.y0 - link.width / 2),
  };
}

function round(x) {
  return Math.round(x * 10) / 10;
}
