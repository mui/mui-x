import { describe, it, expect, beforeEach } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { batchMeasureStrings, clearStringMeasurementCache, getStringSize } from './domUtils';

const TEXT = 'Wednesday 1,000';
const WIDE_STYLE = { fontFamily: 'Roboto', fontWeight: 700, fontSize: 30, letterSpacing: '1em' };

describe.skipIf(isJSDOM)('text measurement isolation', () => {
  beforeEach(() => {
    clearStringMeasurementCache();
  });

  it('should measure a batch the same way whatever ran before it', () => {
    const clean = batchMeasureStrings([TEXT], { fontSize: 12 }).get(TEXT);

    clearStringMeasurementCache();
    batchMeasureStrings(['seed'], WIDE_STYLE);

    expect(batchMeasureStrings([TEXT], { fontSize: 12 }).get(TEXT)).to.deep.eq(clean);
  });

  it('should measure an empty style the same way whatever ran before it', () => {
    const clean = batchMeasureStrings([TEXT], {}).get(TEXT);

    clearStringMeasurementCache();
    batchMeasureStrings(['seed'], WIDE_STYLE);

    expect(batchMeasureStrings([TEXT], {}).get(TEXT)).to.deep.eq(clean);
  });

  it('should not leak a batch style into getStringSize', () => {
    const clean = getStringSize(TEXT, { fontSize: 12 });

    clearStringMeasurementCache();
    batchMeasureStrings(['seed'], WIDE_STYLE);

    expect(getStringSize(TEXT, { fontSize: 12 })).to.deep.eq(clean);
  });

  it('should still apply the style it is given', () => {
    const small = batchMeasureStrings([TEXT], { fontSize: 12 }).get(TEXT)!;
    const large = batchMeasureStrings([TEXT], { fontSize: 24 }).get(TEXT)!;

    expect(large.width).to.be.greaterThan(small.width);
  });
});
