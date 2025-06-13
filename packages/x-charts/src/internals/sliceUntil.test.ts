import { expect } from 'chai';
import { sliceUntil } from './sliceUntil';

describe('sliceUntil', () => {
  it('slices ASCII properly', () => {
    expect(sliceUntil('Hello World', 5)).to.equal('Hello');
    expect(sliceUntil('Hello World', 6)).to.equal('Hello ');
    expect(sliceUntil('Hello World', 7)).to.equal('Hello W');
    expect(sliceUntil('Hello World', 9)).to.equal('Hello Wor');
  });

  it('slices unicode characters properly', () => {
    expect(sliceUntil('emoji👱🏽‍♀️👱🏽‍♀️👱🏽‍♀️', 5)).to.equal('emoji');
    expect(sliceUntil('emoji👱🏽‍♀️👱🏽‍♀️👱🏽‍♀️', 6)).to.equal('emoji👱🏽‍♀️');
    expect(sliceUntil('emoji👱🏽‍♀️👱🏽‍♀️👱🏽‍♀️', 7)).to.equal('emoji👱🏽‍♀️👱🏽‍♀️');
  });
});
