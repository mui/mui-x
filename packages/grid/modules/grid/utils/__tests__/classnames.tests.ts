import { classnames } from '../classnames';

describe('utils: classnames', () => {
  it('should aggregate css classes', () => {
    const css = classnames('hello', 'world');
    expect(css).toBe('hello world');
  });
  it('should work with css rules object', () => {
    const css = classnames('working', { yes: true, no: false });
    expect(css).toBe('working yes');
  });
  it('should work with string arrays ', () => {
    const css = classnames(['working', 'from', 'home']);
    expect(css).toBe('working from home');
  });
  it('should work with all types of params mixed together ', () => {
    const css = classnames(
      'people',
      ['working', 'from', 'home'],
      'are',
      { more: true, less: false, cool: true, and: true },
      ['efficient'],
    );
    expect(css).toBe('people working from home are more cool and efficient');
  });
});
