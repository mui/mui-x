import { classnames } from '../classnames';

describe('utils: classnames', () => {
  it('should aggregate css classes', () => {
    const css = classnames('hello', 'world');

    expect(css).toBe('hello world');
  });
});
