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

    describe('processedResource', () => {
      it('should return null when resourceId is null', () => {
        const resources = [{ id: 'resource-1', title: 'Resource 1' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResource(state, null);
        expect(result).to.equal(null);
      });

      it('should return null when resourceId is undefined', () => {
        const resources = [{ id: 'resource-1', title: 'Resource 1' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResource(state, undefined);
        expect(result).to.equal(null);
      });

      it('should return null when resourceId does not exist', () => {
        const resources = [{ id: 'resource-1', title: 'Resource 1' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResource(state, 'non-existent');
        expect(result).to.equal(null);
      });

      it('should return the processed resource when resourceId exists', () => {
        const resources = [
          { id: 'resource-1', title: 'Resource 1' },
          { id: 'resource-2', title: 'Resource 2' },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResource(state, 'resource-2');
        expect(result).to.deep.contain({ id: 'resource-2', title: 'Resource 2' });
      });

      it('should return child resource when querying with child id', () => {
        const resources = [
          {
            id: 'parent-1',
            title: 'Parent 1',
            children: [{ id: 'child-1', title: 'Child 1' }],
          },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResource(state, 'child-1');
        expect(result).to.deep.contain({ id: 'child-1', title: 'Child 1' });
      });
    });

    describe('processedResourceList', () => {
      it('should return an empty array when there are no resources', () => {
        const state = new storeClass.Value({ events: [] }, adapter).state;
        const result = schedulerResourceSelectors.processedResourceList(state);
        expect(result).to.deep.equal([]);
      });

      it('should return only top-level resources', () => {
        const resources = [
          {
            id: 'parent-1',
            title: 'Parent 1',
            children: [{ id: 'child-1', title: 'Child 1' }],
          },
          { id: 'resource-2', title: 'Resource 2' },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResourceList(state);

        expect(result).to.have.length(2);
        expect(result[0]).to.deep.contain({ id: 'parent-1', title: 'Parent 1' });
        expect(result[1]).to.deep.contain({ id: 'resource-2', title: 'Resource 2' });
      });

      it('should return same reference when inputs have not changed', () => {
        const resources = [{ id: 'resource-1', title: 'Resource 1' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result1 = schedulerResourceSelectors.processedResourceList(state);
        const result2 = schedulerResourceSelectors.processedResourceList(state);
        expect(result1).to.equal(result2);
      });
    });

    describe('processedResourceChildrenLookup', () => {
      it('should return an empty map when there are no resources', () => {
        const state = new storeClass.Value({ events: [] }, adapter).state;
        const result = schedulerResourceSelectors.processedResourceChildrenLookup(state);
        expect(result.size).to.equal(0);
      });

      it('should return an empty map when resources have no children', () => {
        const resources = [
          { id: 'resource-1', title: 'Resource 1' },
          { id: 'resource-2', title: 'Resource 2' },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResourceChildrenLookup(state);
        expect(result.size).to.equal(0);
      });

      it('should return a map with parent ids as keys and children resources as values', () => {
        const resources = [
          {
            id: 'parent-1',
            title: 'Parent 1',
            children: [
              { id: 'child-1', title: 'Child 1' },
              { id: 'child-2', title: 'Child 2' },
            ],
          },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResourceChildrenLookup(state);

        expect(result.size).to.equal(1);
        expect(result.has('parent-1')).to.equal(true);
        const children = result.get('parent-1')!;
        expect(children).to.have.length(2);
        expect(children[0]).to.deep.contain({ id: 'child-1', title: 'Child 1' });
        expect(children[1]).to.deep.contain({ id: 'child-2', title: 'Child 2' });
      });

      it('should handle deeply nested resources', () => {
        const resources = [
          {
            id: 'grandparent',
            title: 'Grandparent',
            children: [
              {
                id: 'parent',
                title: 'Parent',
                children: [{ id: 'child', title: 'Child' }],
              },
            ],
          },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.processedResourceChildrenLookup(state);

        expect(result.size).to.equal(2);
        expect(result.get('grandparent')![0]).to.deep.contain({ id: 'parent', title: 'Parent' });
        expect(result.get('parent')![0]).to.deep.contain({ id: 'child', title: 'Child' });
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
        const result1 = schedulerResourceSelectors.processedResourceChildrenLookup(state);
        const result2 = schedulerResourceSelectors.processedResourceChildrenLookup(state);
        expect(result1).to.equal(result2);
      });
    });

    describe('resourceChildrenIds', () => {
      it('should return an empty array when resource has no children', () => {
        const resources = [{ id: 'resource-1', title: 'Resource 1' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.resourceChildrenIds(state, 'resource-1');
        expect(result).to.deep.equal([]);
      });

      it('should return an empty array when resource does not exist', () => {
        const resources = [{ id: 'resource-1', title: 'Resource 1' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.resourceChildrenIds(state, 'non-existent');
        expect(result).to.deep.equal([]);
      });

      it('should return children ids when resource has children', () => {
        const resources = [
          {
            id: 'parent-1',
            title: 'Parent 1',
            children: [
              { id: 'child-1', title: 'Child 1' },
              { id: 'child-2', title: 'Child 2' },
            ],
          },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.resourceChildrenIds(state, 'parent-1');
        expect(result).to.deep.equal(['child-1', 'child-2']);
      });
    });

    describe('resourceParentIdLookup', () => {
      it('should return an empty map when there are no resources', () => {
        const state = new storeClass.Value({ events: [] }, adapter).state;
        const result = schedulerResourceSelectors.resourceParentIdLookup(state);
        expect(result.size).to.equal(0);
      });

      it('should return an empty map when resources have no children', () => {
        const resources = [
          { id: 'resource-1', title: 'Resource 1' },
          { id: 'resource-2', title: 'Resource 2' },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.resourceParentIdLookup(state);
        expect(result.size).to.equal(0);
      });

      it('should return a map with child ids as keys and parent ids as values', () => {
        const resources = [
          {
            id: 'parent-1',
            title: 'Parent 1',
            children: [
              { id: 'child-1', title: 'Child 1' },
              { id: 'child-2', title: 'Child 2' },
            ],
          },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.resourceParentIdLookup(state);

        expect(result.size).to.equal(2);
        expect(result.get('child-1')).to.equal('parent-1');
        expect(result.get('child-2')).to.equal('parent-1');
      });

      it('should handle deeply nested resources', () => {
        const resources = [
          {
            id: 'grandparent',
            title: 'Grandparent',
            children: [
              {
                id: 'parent',
                title: 'Parent',
                children: [{ id: 'child', title: 'Child' }],
              },
            ],
          },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.resourceParentIdLookup(state);

        expect(result.size).to.equal(2);
        expect(result.get('parent')).to.equal('grandparent');
        expect(result.get('child')).to.equal('parent');
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
        const result1 = schedulerResourceSelectors.resourceParentIdLookup(state);
        const result2 = schedulerResourceSelectors.resourceParentIdLookup(state);
        expect(result1).to.equal(result2);
      });
    });

    describe('visibleIdList', () => {
      it('should return all resource ids when visibleResources is empty', () => {
        const resources = [
          { id: 'resource-1', title: 'Resource 1' },
          { id: 'resource-2', title: 'Resource 2' },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.visibleIdList(state);
        expect(result).to.deep.equal(['resource-1', 'resource-2']);
      });

      it('should filter out resources that are explicitly set to false', () => {
        const resources = [
          { id: 'resource-1', title: 'Resource 1' },
          { id: 'resource-2', title: 'Resource 2' },
          { id: 'resource-3', title: 'Resource 3' },
        ];
        const state = new storeClass.Value(
          { events: [], resources, defaultVisibleResources: { 'resource-2': false } },
          adapter,
        ).state;
        const result = schedulerResourceSelectors.visibleIdList(state);
        expect(result).to.deep.equal(['resource-1', 'resource-3']);
      });

      it('should include resources explicitly set to true', () => {
        const resources = [
          { id: 'resource-1', title: 'Resource 1' },
          { id: 'resource-2', title: 'Resource 2' },
        ];
        const state = new storeClass.Value(
          { events: [], resources, defaultVisibleResources: { 'resource-1': true } },
          adapter,
        ).state;
        const result = schedulerResourceSelectors.visibleIdList(state);
        expect(result).to.deep.equal(['resource-1', 'resource-2']);
      });

      it('should return same reference when inputs have not changed', () => {
        const resources = [{ id: 'resource-1', title: 'Resource 1' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result1 = schedulerResourceSelectors.visibleIdList(state);
        const result2 = schedulerResourceSelectors.visibleIdList(state);
        expect(result1).to.equal(result2);
      });
    });

    describe('defaultEventColor', () => {
      it('should return state eventColor when resourceId is null', () => {
        const resources = [{ id: 'resource-1', title: 'Resource 1', eventColor: 'red' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.defaultEventColor(state, null);
        expect(result).to.equal(state.eventColor);
      });

      it('should return state eventColor when resourceId is undefined', () => {
        const resources = [{ id: 'resource-1', title: 'Resource 1', eventColor: 'red' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.defaultEventColor(state, undefined);
        expect(result).to.equal(state.eventColor);
      });

      it('should return state eventColor when resource has no eventColor', () => {
        const resources = [{ id: 'resource-1', title: 'Resource 1' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.defaultEventColor(state, 'resource-1');
        expect(result).to.equal(state.eventColor);
      });

      it('should return resource eventColor when resource has eventColor', () => {
        const resources = [{ id: 'resource-1', title: 'Resource 1', eventColor: 'ruby' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.defaultEventColor(state, 'resource-1');
        expect(result).to.equal('ruby');
      });

      it('should return state eventColor when resourceId does not exist', () => {
        const resources = [{ id: 'resource-1', title: 'Resource 1', eventColor: 'red' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.defaultEventColor(state, 'non-existent');
        expect(result).to.equal(state.eventColor);
      });
    });
  });
});
