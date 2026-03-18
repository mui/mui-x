import identifierCleaner from './identifierCleaner';

describe('Heatmap identifierCleaner', () => {
  it('should clean a heatmap identifier', () => {
    const identifier = {
      type: 'heatmap',
      seriesId: 'test-heatmap',
      xIndex: 2,
      yIndex: 3,
      extraProp: 'should be removed',
    } as const;

    const cleaned = identifierCleaner(identifier);

    expect(cleaned).to.deep.equal({
      type: 'heatmap',
      seriesId: 'test-heatmap',
      xIndex: 2,
      yIndex: 3,
    });
  });
});
