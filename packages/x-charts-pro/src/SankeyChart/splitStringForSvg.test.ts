import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as internals from '@mui/x-charts/internals';
import { splitStringForSvg } from './splitStringForSvg';

// Mock getStringSize to have predictable behavior
vi.mock('@mui/x-charts/internals', async () => {
  const actual = await vi.importActual('@mui/x-charts/internals');
  return {
    ...actual,
    getStringSize: vi.fn(),
  };
});

describe('splitStringForSvg', () => {
  const mockStyles: React.CSSProperties = {
    fontSize: '12px',
    fontFamily: 'Arial',
  };

  beforeEach(() => {
    // Default mock: each character is 10px wide, height is 20px
    vi.mocked(internals.getStringSize).mockImplementation((text: string | number) => ({
      width: String(text).length * 10,
      height: 20,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when compute is false', () => {
    it('should return the text as a single line', () => {
      const result = splitStringForSvg('Hello World', 50, false, mockStyles);

      expect(result).toEqual({
        lines: ['Hello World'],
        lineHeight: 0,
      });
    });
  });

  describe('when compute is true', () => {
    it('should keep text on one line if it fits within maxWidth', () => {
      const result = splitStringForSvg('Hello', 100, true, mockStyles);

      expect(result.lines).toEqual(['Hello']);
      expect(result.lineHeight).toBe(20);
    });

    it('should split text on spaces when exceeding maxWidth', () => {
      // "Hello World" = 11 chars = 110px
      // maxWidth = 60px, so it should split at the space
      const result = splitStringForSvg('Hello World', 60, true, mockStyles);

      expect(result.lines).toEqual(['Hello', 'World']);
      expect(result.lineHeight).toBe(20);
    });

    it('should split text on hyphens', () => {
      const result = splitStringForSvg('Hello-World', 60, true, mockStyles);

      expect(result.lines).toEqual(['Hello-', 'World']);
    });

    it('should handle newline characters', () => {
      const result = splitStringForSvg('Hello\nWorld', 200, true, mockStyles);

      expect(result.lines).toEqual(['Hello', 'World']);
    });

    it('should filter out empty lines', () => {
      const result = splitStringForSvg('Hello\n\nWorld', 200, true, mockStyles);

      expect(result.lines).toEqual(['Hello', 'World']);
    });

    it('should not create single-character lines from multi-character words', () => {
      // If we try to split at "C" + "ommercial", "C" should be merged back
      const result = splitStringForSvg('Commercial', 25, true, mockStyles);
      expect(result.lines).toEqual(['Co', 'mm', 'er', 'ci', 'al']);
    });

    it('should allow single-character standalone words like "a" or "I"', () => {
      const result = splitStringForSvg('I am a developer', 200, true, mockStyles);

      expect(result.lines).toEqual(['I am a developer']);
    });

    it('should merge single-character fragments with previous line', () => {
      const result = splitStringForSvg('Test C Word', 50, true, mockStyles);

      // Should not have a line with just "C" - single character fragments should be merged
      expect(result.lines).toEqual(['Test', 'C Word']);
    });

    it('should handle very long words that need to be force-split', () => {
      const longWord = 'Supercalifragilisticexpialidocious';
      const result = splitStringForSvg(longWord, 100, true, mockStyles);

      // With 10px per char and 100px maxWidth, should split into 10-char chunks
      expect(result.lines).toEqual(['Supercalif', 'ragilistic', 'expialidoc', 'ious']);
    });

    it('should preserve multiple words on same line if they fit', () => {
      const result = splitStringForSvg('Hi there friend', 200, true, mockStyles);

      expect(result.lines).toEqual(['Hi there friend']);
    });

    it('should handle empty string', () => {
      const result = splitStringForSvg('', 100, true, mockStyles);

      expect(result.lines).toEqual([]);
    });

    it('should handle string with only spaces', () => {
      const result = splitStringForSvg('   ', 100, true, mockStyles);

      expect(result.lines).toEqual([]);
    });

    it('should backtrack to find natural split points', () => {
      // "Energy Generation Commercial" = 29 chars with spaces
      // With maxWidth of 120px (12 chars), should split at word boundaries
      const result = splitStringForSvg('Energy Generation Commercial', 120, true, mockStyles);

      // Should split at spaces, keeping words intact
      expect(result.lines).toEqual(['Energy', 'Generation', 'Commercial']);
    });

    it('should not add random spaces when splitting', () => {
      const result = splitStringForSvg('Gas', 10, true, mockStyles);

      expect(result.lines).toEqual(['Gas']);
    });
  });
});
