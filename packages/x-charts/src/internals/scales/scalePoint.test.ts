import { scalePoint } from './scalePoint';
import { scaleBand } from './scaleBand';

describe('scalePoint', () => {
  it('scalePoint() has the expected defaults', () => {
    const s = scalePoint();
    expect(s.domain()).to.deep.equal([]);
    expect(s.range()).to.deep.equal([0, 1]);
    expect(s.bandwidth()).to.equal(0);
    expect(s.step()).to.equal(1);
    expect(s.round()).to.equal(false);
    expect(s.padding()).to.equal(0);
    expect(s.align()).to.equal(0.5);
  });

  it('scalePoint() does not expose paddingInner and paddingOuter', () => {
    const s = scalePoint() as any;
    expect(s.paddingInner).to.equal(undefined);
    expect(s.paddingOuter).to.equal(undefined);
  });

  it('scalePoint() is similar to scaleBand().paddingInner(1)', () => {
    const p = scalePoint().domain(['foo', 'bar']).range([0, 960]);
    const b = scaleBand().domain(['foo', 'bar']).range([0, 960]).paddingInner(1);
    expect(p.domain().map(p)).to.deep.equal(b.domain().map(b));
    expect(p.bandwidth()).to.equal(b.bandwidth());
    expect(p.step()).to.equal(b.step());
  });

  it('point.padding(p) sets the band outer padding to p', () => {
    const p = scalePoint().domain(['foo', 'bar']).range([0, 960]).padding(0.5);
    const b = scaleBand().domain(['foo', 'bar']).range([0, 960]).paddingInner(1).paddingOuter(0.5);
    expect(p.domain().map(p)).to.deep.equal(b.domain().map(b));
    expect(p.bandwidth()).to.equal(b.bandwidth());
    expect(p.step()).to.equal(b.step());
  });

  it('point.copy() returns a copy', () => {
    const s = scalePoint();
    expect(s.domain()).to.deep.equal([]);
    expect(s.range()).to.deep.equal([0, 1]);
    expect(s.bandwidth()).to.equal(0);
    expect(s.step()).to.equal(1);
    expect(s.round()).to.equal(false);
    expect(s.padding()).to.equal(0);
    expect(s.align()).to.equal(0.5);
  });
});
