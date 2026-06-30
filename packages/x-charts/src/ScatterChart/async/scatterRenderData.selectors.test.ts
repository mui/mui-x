import { packScatterSeriesCoords } from './scatterRenderData.selectors';

const identity = (value: number | Date) => value as number;
const bounds = { xMin: 0, xMax: 100, yMin: 0, yMax: 100 };

describe('packScatterSeriesCoords', () => {
  it('packs every point into a dataIndex slot (stride 3)', () => {
    const data = [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
      { x: 50, y: 60 },
    ];

    const { coords, count } = packScatterSeriesCoords(data, identity, identity, bounds);

    expect(count).to.equal(3);
    expect(coords.length).to.equal(9);
    // Slot i holds [x, y, visible] for dataIndex i.
    expect(Array.from(coords)).to.deep.equal([10, 20, 1, 30, 40, 1, 50, 60, 1]);
  });

  it('flags off-screen points invisible but keeps their slot', () => {
    const data = [
      { x: 10, y: 20 }, // inside
      { x: 200, y: 20 }, // x past xMax
      { x: 10, y: -5 }, // y below yMin
    ];

    const { coords, count } = packScatterSeriesCoords(data, identity, identity, bounds);

    expect(count).to.equal(3);
    expect(coords[2]).to.equal(1);
    expect(coords[5]).to.equal(0);
    expect(coords[8]).to.equal(0);
    // Coordinates are stored even for invisible points (slot preserved).
    expect(coords[3]).to.equal(200);
    expect(coords[7]).to.equal(-5);
  });

  it('treats the bounds as inclusive on both edges', () => {
    const data = [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
    ];

    const { coords } = packScatterSeriesCoords(data, identity, identity, bounds);

    expect(coords[2]).to.equal(1);
    expect(coords[5]).to.equal(1);
  });

  it('applies the position mappers', () => {
    const data = [{ x: 5, y: 5 }];
    const getX = (value: number | Date) => (value as number) * 2;
    const getY = (value: number | Date) => (value as number) + 1;

    const { coords } = packScatterSeriesCoords(data, getX, getY, bounds);

    expect(coords[0]).to.equal(10);
    expect(coords[1]).to.equal(6);
  });

  it('returns an empty array for an empty series', () => {
    const { coords, count } = packScatterSeriesCoords([], identity, identity, bounds);

    expect(count).to.equal(0);
    expect(coords.length).to.equal(0);
  });
});
