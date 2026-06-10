import { collectAffectedCells, orderForRecompute } from './formulaGraph';

/**
 * Builds lookup callbacks from plain edge maps:
 * `dependencies[x]` lists what x reads; dependents is the reverse.
 */
const buildGraph = (dependencies: Record<string, string[]>) => {
  const dependents = new Map<string, string[]>();
  for (const [key, deps] of Object.entries(dependencies)) {
    for (const dep of deps) {
      const list = dependents.get(dep);
      if (list === undefined) {
        dependents.set(dep, [key]);
      } else {
        list.push(key);
      }
    }
  }
  return {
    getDependencies: (key: string) => dependencies[key],
    getDependents: (key: string) => dependents.get(key),
  };
};

describe('formulaGraph', () => {
  describe('collectAffectedCells', () => {
    it('includes the dirty cells themselves', () => {
      const { getDependents } = buildGraph({});
      expect(Array.from(collectAffectedCells(['a'], getDependents))).to.deep.equal(['a']);
    });

    it('collects the transitive dependent closure', () => {
      // a -> b -> c, plus an unrelated x -> y.
      const { getDependents } = buildGraph({ b: ['a'], c: ['b'], y: ['x'] });
      const affected = collectAffectedCells(['a'], getDependents);
      expect(Array.from(affected).sort()).to.deep.equal(['a', 'b', 'c']);
    });

    it('handles diamonds without duplicates', () => {
      // d reads b and c; both read a.
      const { getDependents } = buildGraph({ b: ['a'], c: ['a'], d: ['b', 'c'] });
      const affected = collectAffectedCells(['a'], getDependents);
      expect(Array.from(affected).sort()).to.deep.equal(['a', 'b', 'c', 'd']);
    });

    it('terminates on cyclic graphs', () => {
      const { getDependents } = buildGraph({ a: ['b'], b: ['a'] });
      const affected = collectAffectedCells(['a'], getDependents);
      expect(Array.from(affected).sort()).to.deep.equal(['a', 'b']);
    });

    it('survives chains tens of thousands deep (iterative, no stack overflow)', () => {
      const dependencies: Record<string, string[]> = {};
      for (let i = 1; i < 50000; i += 1) {
        dependencies[`n${i}`] = [`n${i - 1}`];
      }
      const { getDependents } = buildGraph(dependencies);
      const affected = collectAffectedCells(['n0'], getDependents);
      expect(affected.size).to.equal(50000);
    });
  });

  describe('orderForRecompute', () => {
    it('orders a chain dependency-first', () => {
      const { getDependencies } = buildGraph({ b: ['a'], c: ['b'] });
      const { order, cyclic } = orderForRecompute(new Set(['a', 'b', 'c']), getDependencies);
      expect(order).to.deep.equal(['a', 'b', 'c']);
      expect(cyclic.size).to.equal(0);
    });

    it('orders a diamond so each cell recomputes once after its deps', () => {
      const { getDependencies } = buildGraph({ b: ['a'], c: ['a'], d: ['b', 'c'] });
      const { order, cyclic } = orderForRecompute(new Set(['a', 'b', 'c', 'd']), getDependencies);
      expect(cyclic.size).to.equal(0);
      expect(order).to.have.length(4);
      expect(order.indexOf('a')).to.be.lessThan(order.indexOf('b'));
      expect(order.indexOf('a')).to.be.lessThan(order.indexOf('c'));
      expect(order.indexOf('b')).to.be.lessThan(order.indexOf('d'));
      expect(order.indexOf('c')).to.be.lessThan(order.indexOf('d'));
    });

    it('ignores dependencies outside the affected set', () => {
      // b reads a, but a is not affected (its value is final).
      const { getDependencies } = buildGraph({ b: ['a'] });
      const { order, cyclic } = orderForRecompute(new Set(['b']), getDependencies);
      expect(order).to.deep.equal(['b']);
      expect(cyclic.size).to.equal(0);
    });

    it('reports a two-cycle as cyclic', () => {
      const { getDependencies } = buildGraph({ a: ['b'], b: ['a'] });
      const { order, cyclic } = orderForRecompute(new Set(['a', 'b']), getDependencies);
      expect(order).to.deep.equal([]);
      expect(Array.from(cyclic).sort()).to.deep.equal(['a', 'b']);
    });

    it('reports a self-cycle as cyclic', () => {
      const { getDependencies } = buildGraph({ a: ['a'] });
      const { order, cyclic } = orderForRecompute(new Set(['a']), getDependencies);
      expect(order).to.deep.equal([]);
      expect(Array.from(cyclic)).to.deep.equal(['a']);
    });

    it('locks cells downstream of a cycle into the cyclic set', () => {
      // a <-> b cycle; c reads b; d is independent.
      const { getDependencies } = buildGraph({ a: ['b'], b: ['a'], c: ['b'], d: [] });
      const { order, cyclic } = orderForRecompute(new Set(['a', 'b', 'c', 'd']), getDependencies);
      expect(order).to.deep.equal(['d']);
      expect(Array.from(cyclic).sort()).to.deep.equal(['a', 'b', 'c']);
    });

    it('peels the acyclic part feeding into a cycle', () => {
      // x is a plain dependency of the cyclic pair: x peels, the cycle does not.
      const { getDependencies } = buildGraph({ a: ['b', 'x'], b: ['a'], x: [] });
      const { order, cyclic } = orderForRecompute(new Set(['a', 'b', 'x']), getDependencies);
      expect(order).to.deep.equal(['x']);
      expect(Array.from(cyclic).sort()).to.deep.equal(['a', 'b']);
    });

    it('orders chains tens of thousands deep in linear time without stack overflow', () => {
      const dependencies: Record<string, string[]> = {};
      const affected = new Set<string>(['n0']);
      for (let i = 1; i < 50000; i += 1) {
        dependencies[`n${i}`] = [`n${i - 1}`];
        affected.add(`n${i}`);
      }
      const { getDependencies } = buildGraph(dependencies);
      const { order, cyclic } = orderForRecompute(affected, getDependencies);
      expect(cyclic.size).to.equal(0);
      expect(order).to.have.length(50000);
      expect(order[0]).to.equal('n0');
      expect(order[order.length - 1]).to.equal('n49999');
    });

    it('leaves untouched siblings out of the order (dirty-subgraph scoping)', () => {
      const { getDependencies, getDependents } = buildGraph({
        b: ['a'],
        c: ['a'],
        z: ['y'],
      });
      const affected = collectAffectedCells(['a'], getDependents);
      const { order } = orderForRecompute(affected, getDependencies);
      expect(order).to.not.include('y');
      expect(order).to.not.include('z');
    });
  });
});
