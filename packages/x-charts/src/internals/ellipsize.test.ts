import { expect } from 'chai';
import { ellipsize } from './ellipsize';
import { degToRad } from './degToRad';

describe('ellipsizeText', () => {
  it('does nothing if text fits', () => {
    expect(
      ellipsize('Hello World', {
        width: 110,
        height: 20,
        angle: 0,
        measureText: (text) => ({ width: text.length * 10, height: 20 }),
      }),
    ).to.be.equal('Hello World');

    expect(
      ellipsize('Hello World', {
        width: 110 * Math.cos(degToRad(45)) + 20 * Math.sin(degToRad(45)),
        height: 110 * Math.sin(degToRad(45)) + 20 * Math.cos(degToRad(45)),
        angle: 45,
        measureText: (text) => ({ width: text.length * 10, height: 20 }),
      }),
    ).to.be.equal('Hello World');
  });

  it("shortens text and adds ellipsis if it doesn't fit", () => {
    expect(
      ellipsize('Hello World', {
        width: 60,
        height: 20,
        angle: 0,
        measureText: (text) => ({ width: text.length * 10, height: 20 }),
      }),
    ).to.be.equal('Hello…');

    expect(
      ellipsize('Hello World', {
        width: 60 * Math.cos(degToRad(45)) + 20 * Math.sin(degToRad(45)),
        height: 60 * Math.sin(degToRad(45)) + 20 * Math.cos(degToRad(45)),
        angle: 45,
        measureText: (text) => ({ width: text.length * 10, height: 20 }),
      }),
    ).to.be.equal('Hello…');
  });

  it("returns an empty string if text doesn't fit at all", () => {
    expect(
      ellipsize('Hello World', {
        width: 1,
        height: 20,
        angle: 0,
        measureText: (text) => ({ width: text.length * 10, height: 20 }),
      }),
    ).to.be.equal('');

    expect(
      ellipsize('Hello World', {
        width: 11,
        height: 20,
        angle: 0,
        measureText: (text) => ({ width: text.length * 10, height: 20 }),
      }),
    ).to.be.equal('');
  });
});
