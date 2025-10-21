import { getStyleString } from './domUtils';

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
