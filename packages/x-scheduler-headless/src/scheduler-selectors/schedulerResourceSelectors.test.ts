import { adapter } from 'test/utils/scheduler';
import { schedulerResourceSelectors } from './schedulerResourceSelectors';
import { storeClasses } from '../utils/SchedulerStore/tests/utils';

storeClasses.forEach((storeClass) => {
  describe(`schedulerResourceSelectors - ${storeClass.name}`, () => {
    describe('processedResourceFlatList', () => {
      it('should return an empty array when there are no resources', () => {
        const state = new storeClass.Value({ events: [] }, adapter).state;
        const result = schedulerResourceSelectors.processedResourceFlatList(state);
        expect(result).to.deep.equal([]);
      });

      it('should return flat resources when resources have no children', () => {
        const resources = [
          { id: 'resource-1', title: 'Resource 1' },
          { id: 'resource-2', title: 'Resource 2' },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResourceFlatList(state);

        expect(result).to.have.length(2);
        expect(result[0]).to.deep.contain({ id: 'resource-1', title: 'Resource 1' });
        expect(result[1]).to.deep.contain({ id: 'resource-2', title: 'Resource 2' });
      });

      it('should return a flat list including parent and children resources in order', () => {
        const resources = [
          {
            id: 'parent-1',
            title: 'Parent 1',
            children: [
              { id: 'child-1', title: 'Child 1' },
              { id: 'child-2', title: 'Child 2' },
            ],
          },
          { id: 'resource-2', title: 'Resource 2' },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResourceFlatList(state);

        expect(result).to.have.length(4);
        expect(result[0]).to.deep.contain({ id: 'parent-1', title: 'Parent 1' });
        expect(result[1]).to.deep.contain({ id: 'child-1', title: 'Child 1' });
        expect(result[2]).to.deep.contain({ id: 'child-2', title: 'Child 2' });
        expect(result[3]).to.deep.contain({ id: 'resource-2', title: 'Resource 2' });
      });

      it('should handle deeply nested resources', () => {
        const resources = [
          {
            id: 'grandparent-1',
            title: 'Grandparent 1',
            children: [
              {
                id: 'parent-1',
                title: 'Parent 1',
                children: [{ id: 'child-1', title: 'Child 1' }],
              },
            ],
          },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResourceFlatList(state);

        expect(result).to.have.length(3);
        expect(result[0]).to.deep.contain({ id: 'grandparent-1', title: 'Grandparent 1' });
        expect(result[1]).to.deep.contain({ id: 'parent-1', title: 'Parent 1' });
        expect(result[2]).to.deep.contain({ id: 'child-1', title: 'Child 1' });
      });

      it('should handle multiple parents with children', () => {
        const resources = [
          {
            id: 'parent-1',
            title: 'Parent 1',
            children: [{ id: 'child-1a', title: 'Child 1a' }],
          },
          {
            id: 'parent-2',
            title: 'Parent 2',
            children: [{ id: 'child-2a', title: 'Child 2a' }],
          },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResourceFlatList(state);

        expect(result).to.have.length(4);
        expect(result[0]).to.deep.contain({ id: 'parent-1', title: 'Parent 1' });
        expect(result[1]).to.deep.contain({ id: 'child-1a', title: 'Child 1a' });
        expect(result[2]).to.deep.contain({ id: 'parent-2', title: 'Parent 2' });
        expect(result[3]).to.deep.contain({ id: 'child-2a', title: 'Child 2a' });
      });

      it('should return same reference when inputs have not changed', () => {
        const resources = [
          {
            id: 'parent-1',
            title: 'Parent 1',
            children: [{ id: 'child-1', title: 'Child 1' }],
          },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result1 = schedulerResourceSelectors.processedResourceFlatList(state);
        const result2 = schedulerResourceSelectors.processedResourceFlatList(state);

        expect(result1).to.equal(result2);
      });
    });
  });
});
