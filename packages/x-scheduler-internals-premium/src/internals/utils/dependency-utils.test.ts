import { describe, it, expect } from 'vitest';
import { getDependencyEdges, getDependencyType } from './dependency-utils';

describe('dependency-utils', () => {
  describe('getDependencyEdges', () => {
    it('should map each type to the event edges it connects', () => {
      expect(getDependencyEdges('FinishToStart')).to.deep.equal({ source: 'end', target: 'start' });
      expect(getDependencyEdges('StartToStart')).to.deep.equal({
        source: 'start',
        target: 'start',
      });
      expect(getDependencyEdges('FinishToFinish')).to.deep.equal({ source: 'end', target: 'end' });
      expect(getDependencyEdges('StartToFinish')).to.deep.equal({
        source: 'start',
        target: 'end',
      });
    });
  });

  describe('getDependencyType', () => {
    it('should resolve the type from the dragged and dropped edges', () => {
      expect(getDependencyType('end', 'start')).to.equal('FinishToStart');
      expect(getDependencyType('start', 'start')).to.equal('StartToStart');
      expect(getDependencyType('end', 'end')).to.equal('FinishToFinish');
      expect(getDependencyType('start', 'end')).to.equal('StartToFinish');
    });
  });
});
