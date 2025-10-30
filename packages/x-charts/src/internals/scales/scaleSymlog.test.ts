import { scaleSymlog } from './scaleSymlog';

describe('symlogScale', () => {
  describe('copy', () => {
    it('properly copies the `ticks` and `tickFormat` functions', () => {
      const scale = scaleSymlog([0, 60_000], [0, 100]);
      const tickNumber = 8;
      const expectedTicks = ['0', '1', '10', '100', '1k', '10k'];

      expect(
        scale
          .ticks(tickNumber)
          .map(scale.tickFormat(tickNumber))
          .filter((s) => s !== ''),
      ).to.deep.equal(expectedTicks);

      const scaleCopy = scale.copy();

      expect(
        scale
          .ticks(tickNumber)
          .map(scaleCopy.tickFormat(tickNumber))
          .filter((s) => s !== ''),
      ).to.deep.equal(expectedTicks);
    });
  });
});
