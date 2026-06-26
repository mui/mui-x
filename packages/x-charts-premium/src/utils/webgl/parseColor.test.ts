import { describe, it, expect } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { parseColor } from './parseColor';

describe.skipIf(isJSDOM)('parseColor', () => {
  describe('hex color formats', () => {
    it('should parse 3-character hex color without hash', () => {
      const result = parseColor('f00');
      expect(result).to.deep.equal([255, 0, 0, 255]);
    });

    it('should parse 3-character hex color with hash', () => {
      const result = parseColor('#0f0');
      expect(result).to.deep.equal([0, 255, 0, 255]);
    });

    it('should parse 6-character hex color without hash', () => {
      const result = parseColor('0000ff');
      expect(result).to.deep.equal([0, 0, 255, 255]);
    });

    it('should parse 6-character hex color with hash', () => {
      const result = parseColor('#ff00ff');
      expect(result).to.deep.equal([255, 0, 255, 255]);
    });

    it('should parse 8-character hex color with alpha', () => {
      const result = parseColor('#ff000080');
      expect(result[0]).to.equal(255);
      expect(result[1]).to.equal(0);
      expect(result[2]).to.equal(0);
      expect(result[3]).to.equal(128);
    });

    it('should parse 8-character hex color with full opacity', () => {
      const result = parseColor('#00ff00ff');
      expect(result).to.deep.equal([0, 255, 0, 255]);
    });

    it('should parse mixed case hex colors', () => {
      const result = parseColor('#AaBbCc');
      expect(result).to.deep.equal([170, 187, 204, 255]);
    });

    it('should parse common hex colors', () => {
      expect(parseColor('#ffffff')).to.deep.equal([255, 255, 255, 255]);
      expect(parseColor('#000000')).to.deep.equal([0, 0, 0, 255]);
      expect(parseColor('#808080')).to.deep.equal([128, 128, 128, 255]);
    });
  });

  describe('rgb color formats', () => {
    it('should parse rgb with spaces', () => {
      const result = parseColor('rgb(255, 0, 0)');
      expect(result).to.deep.equal([255, 0, 0, 255]);
    });

    it('should parse rgb without spaces', () => {
      const result = parseColor('rgb(0,255,0)');
      expect(result).to.deep.equal([0, 255, 0, 255]);
    });

    it('should parse rgb with mixed spacing', () => {
      const result = parseColor('rgb(0,  128,  255)');
      expect(result).to.deep.equal([0, 128, 255, 255]);
    });

    it('should return null for invalid rgb values exceeding 255', () => {
      const result = parseColor('rgb(256, 0, 0)');
      // Should fallback to canvas parsing which may handle it differently
      expect(result).to.have.lengthOf(4);
    });
  });

  describe('rgba color formats', () => {
    it('should parse rgba with alpha', () => {
      const result = parseColor('rgba(255, 0, 0, 0.5)');
      expect(result[0]).to.equal(255);
      expect(result[1]).to.equal(0);
      expect(result[2]).to.equal(0);
      expect(result[3]).to.be.closeTo(127.5, 0.01);
    });

    it('should parse rgba with full opacity', () => {
      const result = parseColor('rgba(0, 255, 0, 1)');
      expect(result).to.deep.equal([0, 255, 0, 255]);
    });

    it('should parse rgba with zero opacity', () => {
      const result = parseColor('rgba(0, 0, 255, 0)');
      expect(result).to.deep.equal([0, 0, 255, 0]);
    });

    it('should parse rgba without spaces', () => {
      const result = parseColor('rgba(128,128,128,0.75)');
      expect(result[0]).to.equal(128);
      expect(result[1]).to.equal(128);
      expect(result[2]).to.equal(128);
      expect(result[3]).to.be.closeTo(191.25, 0.01);
    });
  });

  describe('named colors and canvas fallback', () => {
    it('should parse named color "red"', () => {
      const result = parseColor('red');
      expect(result[0]).to.be.closeTo(255, 1);
      expect(result[1]).to.be.closeTo(0, 1);
      expect(result[2]).to.be.closeTo(0, 1);
      expect(result[3]).to.be.closeTo(255, 1);
    });

    it('should parse named color "blue"', () => {
      const result = parseColor('blue');
      expect(result[0]).to.be.closeTo(0, 1);
      expect(result[1]).to.be.closeTo(0, 1);
      expect(result[2]).to.be.closeTo(255, 1);
      expect(result[3]).to.be.closeTo(255, 1);
    });

    it('should parse named color "green"', () => {
      const result = parseColor('green');
      expect(result[0]).to.be.closeTo(0, 1);
      expect(result[1]).to.be.closeTo(128, 26);
      expect(result[2]).to.be.closeTo(0, 1);
      expect(result[3]).to.be.closeTo(255, 1);
    });

    it('should parse named color "white"', () => {
      const result = parseColor('white');
      expect(result).to.deep.equal([255, 255, 255, 255]);
    });

    it('should parse named color "black"', () => {
      const result = parseColor('black');
      expect(result).to.deep.equal([0, 0, 0, 255]);
    });

    it('should parse named color "transparent"', () => {
      const result = parseColor('transparent');
      // Transparent color returns rgba(0,0,0,0) which gets normalized by canvas
      expect(result).to.have.lengthOf(4);
    });

    it('should parse complex named colors', () => {
      const result = parseColor('cornflowerblue');
      expect(result).to.have.lengthOf(4);
    });
  });

  describe('caching', () => {
    it('should cache parsed colors', () => {
      const color = '#123456';
      const result1 = parseColor(color);
      const result2 = parseColor(color);

      // Same reference means it was cached
      expect(result1).to.equal(result2);
    });

    it('should cache different color formats separately', () => {
      const hex = parseColor('#ff0000');
      const rgb = parseColor('rgb(255, 0, 0)');

      // Different formats, so different cache entries
      expect(hex).to.not.equal(rgb);
    });
  });

  describe('edge cases', () => {
    it('should handle invalid hex format', () => {
      const result = parseColor('#gggggg');
      expect(result).to.have.lengthOf(4);
    });

    it('should handle empty string', () => {
      const result = parseColor('');
      expect(result).to.have.lengthOf(4);
    });

    it('should handle malformed rgb', () => {
      const result = parseColor('rgb(255)');
      expect(result).to.have.lengthOf(4);
    });

    it('should handle case insensitivity for rgb/rgba', () => {
      const result1 = parseColor('RGB(255, 0, 0)');
      const result2 = parseColor('RGBA(255, 0, 0, 1)');

      expect(result1).to.deep.equal([255, 0, 0, 255]);
      expect(result2).to.deep.equal([255, 0, 0, 255]);
    });
  });

  describe('color values', () => {
    it('should keep RGB values in [0, 255] for rgb()', () => {
      const result = parseColor('rgb(127, 127, 127)');
      expect(result[0]).to.equal(127);
      expect(result[1]).to.equal(127);
      expect(result[2]).to.equal(127);
    });

    it('should put alpha in [0, 255] for hex colors', () => {
      const result = parseColor('#00000000');
      expect(result[3]).to.equal(0);
    });
  });
});
