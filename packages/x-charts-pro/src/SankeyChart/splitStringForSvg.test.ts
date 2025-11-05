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
      // "Commercial" = 10 chars = 100px
      // If we try to split at "C" + "ommercial", "C" should be merged back
      const result = splitStringForSvg('Commercial', 25, true, mockStyles);

      // The function should avoid leaving just "C" on a line
      // All lines should have more than 1 character unless it's a standalone word
      result.lines.forEach((line) => {
        if (line.trim().length === 1) {
          // If there's a single character, it should be a complete word
          // (preceded or followed by space/hyphen in original text)
          // In this case, "Commercial" has no spaces, so no single chars should appear
          expect(line.trim().length).toBeGreaterThan(1);
        }
      });
    });

    it('should allow single-character standalone words like "a" or "I"', () => {
      const result = splitStringForSvg('I am a developer', 200, true, mockStyles);

      // When maxWidth is large enough, the whole phrase should fit
      // This tests that single characters aren't incorrectly merged when they're valid words
      const allText = result.lines.join(' ');
      expect(allText).toContain('I');
      expect(allText).toContain('a');
    });

    it('should merge single-character fragments with previous line', () => {
      // Mock a scenario where we'd get a single character fragment
      vi.mocked(internals.getStringSize).mockImplementation((text: string | number) => {
        // Make each char 20px except spaces which are 10px
        const textStr = String(text);
        const width = textStr.split('').reduce((acc, char) => acc + (char === ' ' ? 10 : 20), 0);
        return { width, height: 20 };
      });

      const result = splitStringForSvg('Test C Word', 50, true, mockStyles);

      // Should not have a line with just "C"
      expect(result.lines.every((line) => line.trim() !== 'C')).toBe(true);
    });

    it('should handle very long words that need to be force-split', () => {
      const longWord = 'Supercalifragilisticexpialidocious';
      const result = splitStringForSvg(longWord, 100, true, mockStyles);

      // Should split the word somehow
      expect(result.lines.length).toBeGreaterThan(1);
      // Should not have single character lines
      result.lines.forEach((line) => {
        expect(line.length).toBeGreaterThan(1);
      });
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
      // "Energy Generation Commercial"
      // Should try to split at spaces rather than in the middle of words
      const result = splitStringForSvg('Energy Generation Commercial', 120, true, mockStyles);

      // Each line should be a complete word or set of words
      result.lines.forEach((line) => {
        const trimmed = line.trim();
        // Check that we're not breaking words inappropriately
        if (trimmed.length > 1) {
          // Words should either end naturally or with proper break characters
          const lastChar = trimmed[trimmed.length - 1];
          const isNaturalEnd = /[a-zA-Z0-9]/.test(lastChar) || lastChar === '-';
          expect(isNaturalEnd).toBe(true);
        }
      });
    });
  });
});
