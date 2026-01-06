import identifierCleaner from './identifierCleaner';

describe('Sankey identifierCleaner', () => {
  describe('node identifiers', () => {
    it('should clean a node identifier', () => {
      const identifier = {
        type: 'sankey',
        seriesId: 'test-sankey',
        subType: 'node',
        nodeId: 'A',
        extraProp: 'should be removed',
      } as const;

      const cleaned = identifierCleaner(identifier);

      expect(cleaned).to.deep.equal({
        type: 'sankey',
        seriesId: 'test-sankey',
        subType: 'node',
        nodeId: 'A',
      });
    });
  });

  describe('link identifiers', () => {
    it('should clean a link identifier', () => {
      const identifier = {
        type: 'sankey',
        seriesId: 'test-sankey',
        subType: 'link',
        sourceId: 'A',
        targetId: 'B',
        extraProp: 'should be removed',
      } as const;

      const cleaned = identifierCleaner(identifier);

      expect(cleaned).to.deep.equal({
        type: 'sankey',
        seriesId: 'test-sankey',
        subType: 'link',
        sourceId: 'A',
        targetId: 'B',
      });
    });
  });
});
