import { adapter, storeClasses } from 'test/utils/scheduler';
import { schedulerResourceSelectors } from './schedulerResourceSelectors';

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

    describe('visibleMap', () => {
      it('should return all resources as visible when visibleResources is empty', () => {
        const resources = [
          { id: 'resource-1', title: 'Resource 1' },
          { id: 'resource-2', title: 'Resource 2' },
        ];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.visibleMap(state);
        expect(result['resource-1']).to.not.equal(false);
        expect(result['resource-2']).to.not.equal(false);
      });

      it('should mark a resource as hidden when it is explicitly set to false', () => {
        const resources = [
          { id: 'resource-1', title: 'Resource 1' },
          { id: 'resource-2', title: 'Resource 2' },
        ];
        const state = new storeClass.Value(
          { events: [], resources, defaultVisibleResources: { 'resource-1': false } },
          adapter,
        ).state;
        const result = schedulerResourceSelectors.visibleMap(state);
        expect(result['resource-1']).to.equal(false);
        expect(result['resource-2']).to.not.equal(false);
      });

      it('should mark a child as hidden when its parent is hidden', () => {
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
        const state = new storeClass.Value(
          { events: [], resources, defaultVisibleResources: { 'parent-1': false } },
          adapter,
        ).state;
        const result = schedulerResourceSelectors.visibleMap(state);
        expect(result['parent-1']).to.equal(false);
        expect(result['child-1']).to.equal(false);
        expect(result['child-2']).to.equal(false);
      });

      it('should mark deeply nested children as hidden when an ancestor is hidden', () => {
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
        const state = new storeClass.Value(
          { events: [], resources, defaultVisibleResources: { grandparent: false } },
          adapter,
        ).state;
        const result = schedulerResourceSelectors.visibleMap(state);
        expect(result.grandparent).to.equal(false);
        expect(result.parent).to.equal(false);
        expect(result.child).to.equal(false);
      });

      it('should keep siblings visible when only one child is hidden', () => {
        const resources = [
          {
            id: 'parent',
            title: 'Parent',
            children: [
              { id: 'child-1', title: 'Child 1' },
              { id: 'child-2', title: 'Child 2' },
            ],
          },
        ];
        const state = new storeClass.Value(
          { events: [], resources, defaultVisibleResources: { 'child-1': false } },
          adapter,
        ).state;
        const result = schedulerResourceSelectors.visibleMap(state);
        expect(result.parent).to.not.equal(false);
        expect(result['child-1']).to.equal(false);
        expect(result['child-2']).to.not.equal(false);
      });

      it('should hide a child even if explicitly true when its parent is hidden', () => {
        const resources = [
          {
            id: 'parent',
            title: 'Parent',
            children: [{ id: 'child', title: 'Child' }],
          },
        ];
        const state = new storeClass.Value(
          {
            events: [],
            resources,
            defaultVisibleResources: { parent: false, child: true },
          },
          adapter,
        ).state;
        const result = schedulerResourceSelectors.visibleMap(state);
        expect(result.parent).to.equal(false);
        expect(result.child).to.equal(false);
      });

      it('should hide only the target branch when a mid-level parent is hidden', () => {
        const resources = [
          {
            id: 'grandparent',
            title: 'Grandparent',
            children: [
              {
                id: 'parent-a',
                title: 'Parent A',
                children: [{ id: 'child-a', title: 'Child A' }],
              },
              {
                id: 'parent-b',
                title: 'Parent B',
                children: [{ id: 'child-b', title: 'Child B' }],
              },
            ],
          },
        ];
        const state = new storeClass.Value(
          { events: [], resources, defaultVisibleResources: { 'parent-a': false } },
          adapter,
        ).state;
        const result = schedulerResourceSelectors.visibleMap(state);
        expect(result.grandparent).to.not.equal(false);
        expect(result['parent-a']).to.equal(false);
        expect(result['child-a']).to.equal(false);
        expect(result['parent-b']).to.not.equal(false);
        expect(result['child-b']).to.not.equal(false);
      });

      it('should return same reference when inputs have not changed', () => {
        const resources = [
          {
            id: 'parent',
            title: 'Parent',
            children: [{ id: 'child', title: 'Child' }],
          },
        ];
        const state = new storeClass.Value(
          { events: [], resources, defaultVisibleResources: { parent: false } },
          adapter,
        ).state;
        const result1 = schedulerResourceSelectors.visibleMap(state);
        const result2 = schedulerResourceSelectors.visibleMap(state);
        expect(result1).to.equal(result2);
      });

      it('should return raw visibleResources when there are no parent-child relationships', () => {
        const resources = [
          { id: 'resource-1', title: 'Resource 1' },
          { id: 'resource-2', title: 'Resource 2' },
        ];
        const state = new storeClass.Value(
          { events: [], resources, defaultVisibleResources: { 'resource-1': false } },
          adapter,
        ).state;
        const result = schedulerResourceSelectors.visibleMap(state);
        // Fast path should return the raw state.visibleResources reference
        expect(result).to.equal(state.visibleResources);
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
        const resources = [{ id: 'resource-1', title: 'Resource 1', eventColor: 'purple' }];
        const state = new storeClass.Value({ events: [], resources }, adapter).state;
        const result = schedulerResourceSelectors.defaultEventColor(state, 'resource-1');
        expect(result).to.equal('purple');
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
