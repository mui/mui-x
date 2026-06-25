import { createZoomLookup } from './createZoomLookup';

const axis = (zoom: any, dataLength: number) => [
  { id: 'x', scaleType: 'band', data: Array.from({ length: dataLength }), zoom },
];

describe('createZoomLookup', () => {
  it('resolves minSpanItems / maxSpanItems against the data length', () => {
    const lookup = createZoomLookup('x')(
      axis({ minSpanItems: 20, maxSpanItems: 100 }, 200) as any,
    );
    expect(lookup.x.minSpan).to.equal(10); // 20 / 200 -> 10%
    expect(lookup.x.maxSpan).to.equal(50); // 100 / 200 -> 50%
  });

  it('lets the item limits take precedence over the percentage span', () => {
    const lookup = createZoomLookup('x')(axis({ minSpan: 25, minSpanItems: 20 }, 200) as any);
    expect(lookup.x.minSpan).to.equal(10);
  });

  it('keeps the percentage span when no item limits are set', () => {
    const lookup = createZoomLookup('x')(axis({ minSpan: 25 }, 200) as any);
    expect(lookup.x.minSpan).to.equal(25);
  });

  it('clamps to 100 when the requested items exceed the data length', () => {
    const lookup = createZoomLookup('x')(axis({ minSpanItems: 50 }, 10) as any);
    expect(lookup.x.minSpan).to.equal(100);
  });
});
