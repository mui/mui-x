import { describe, it, expect } from 'vitest';
import * as locales from './index';

const SCRIPTS = ['Latin', 'Cyrillic', 'Greek'];

// A word with letters from two of these alphabets is almost always a typo:
// a lookalike letter typed with another keyboard layout (Latin "A" in "Aдкрыць").
const getMixedScriptWords = (text: string) =>
  (text.match(/[\p{L}\p{M}]+/gu) ?? []).filter(
    (word) =>
      SCRIPTS.filter((script) => new RegExp(`\\p{Script=${script}}`, 'u').test(word)).length > 1,
  );

describe('locales', () => {
  Object.entries(locales).forEach(([name, localization]) => {
    it(`${name} should not mix letters from different alphabets in a word`, () => {
      const localeText =
        'components' in localization
          ? localization.components.MuiLocalizationProvider.defaultProps.localeText
          : localization;
      const mixedScriptWords = Object.values(localeText)
        .filter((value): value is string => typeof value === 'string')
        .flatMap(getMixedScriptWords);
      expect(mixedScriptWords).to.deep.equal([]);
    });
  });
});
