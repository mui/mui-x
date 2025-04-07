import { expect } from 'chai';
import { clampAngle } from './clampAngle';

describe('clampAngle', () => {
  it('should clamp angle', () => {
    const tests = [
      { input: 0, expected: 0 },
      { input: 360, expected: 0 },
      { input: 720, expected: 0 },
      { input: -360, expected: 0 },
      { input: -360 - 90, expected: 270 },
      { input: 45, expected: 45 },
      { input: 405, expected: 45 },
      { input: -315, expected: 45 },
      { input: -45, expected: 315 },
    ];

    tests.forEach(({ input, expected }) => {
      expect(clampAngle(input)).to.eq(expected);
    });
  });
});
