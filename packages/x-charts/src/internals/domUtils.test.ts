import { describe, it, expect, beforeEach } from 'vitest';
import {
  batchMeasureStrings,
  clearStringMeasurementCache,
  getStringSize,
  getStyleString,
} from './domUtils';

describe('getStyleString', () => {
  it('should convert style object to a string', () => {
    const style = {
      fontSize: 12,
      fontFamily: 'Arial',
      fontLanguageOverride: 'body',
    };

    expect(getStyleString(style)).to.eq(
      'font-size:12px;font-family:Arial;font-language-override:body;',
    );
  });
});

describe('text measurement container', () => {
  beforeEach(() => {
    clearStringMeasurementCache();
  });

  function getContainer() {
    return document.body.querySelector('svg[aria-hidden="true"]') as SVGSVGElement;
  }

  it('should not keep the styles of the previous batch', () => {
    batchMeasureStrings(['first'], { fontWeight: 700, fontSize: 20 });

    expect(getContainer().style.fontWeight).to.eq('700');

    batchMeasureStrings(['second'], { fontSize: 12 });

    expect(getContainer().style.fontWeight).to.eq('');
    expect(getContainer().style.fontSize).to.eq('12px');
  });

  it('should not leak batch styles into single string measurements', () => {
    batchMeasureStrings(['first'], { fontWeight: 700 });

    getStringSize('second', { fontSize: 12 });

    expect(getContainer().style.fontWeight).to.eq('');
  });
});
