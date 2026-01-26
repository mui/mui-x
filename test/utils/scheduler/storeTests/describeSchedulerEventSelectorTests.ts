import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { DEFAULT_EVENT_CREATION_CONFIG } from '@mui/x-scheduler-headless/constants';
import { adapter, EventBuilder } from '../index';
import type { SchedulerStoreClassDescriptor } from './types';

const defaultEvent = EventBuilder.new().id('event-1').build();
const readOnlyEvent = EventBuilder.new().id('event-1').readOnly().build();

export function describeSchedulerEventSelectorTests(storeClass: SchedulerStoreClassDescriptor) {
  describe(`schedulerEventSelectors - ${storeClass.name}`, () => {
    describe('creationConfig', () => {
      it('should return the default config when props.eventCreation is not defined', () => {
        const state = new storeClass.Value({ events: [] }, adapter).state;
        expect(schedulerEventSelectors.creationConfig(state)).to.deep.equal(
          DEFAULT_EVENT_CREATION_CONFIG,
        );
      });

      it('should return false when props.eventCreation is false', () => {
        const state = new storeClass.Value({ events: [], eventCreation: false }, adapter).state;
        expect(schedulerEventSelectors.creationConfig(state)).to.equal(false);
      });

      it('should return the default config when props.eventCreation is true', () => {
        const state = new storeClass.Value({ events: [], eventCreation: true }, adapter).state;
        expect(schedulerEventSelectors.creationConfig(state)).to.deep.equal(
          DEFAULT_EVENT_CREATION_CONFIG,
        );
      });

      it('should merge the default config with props.eventCreation when it is an object', () => {
        const customConfig = {
          duration: 60,
        };
        const state = new storeClass.Value({ events: [], eventCreation: customConfig }, adapter)
          .state;
        expect(schedulerEventSelectors.creationConfig(state)).to.deep.equal({
          ...DEFAULT_EVENT_CREATION_CONFIG,
          ...customConfig,
        });
      });

      it('should return false when the scheduler is read-only', () => {
        const state = new storeClass.Value(
          { events: [], readOnly: true, eventCreation: true },
          adapter,
        ).state;
        expect(schedulerEventSelectors.creationConfig(state)).to.equal(false);
      });
    });

    describe('isDraggable', () => {
      it('should return false when areEventsDraggable is not defined', () => {
        const state = new storeClass.Value(
          { events: [defaultEvent], areEventsDraggable: undefined },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
      });

      it('should return false when areEventsDraggable is false', () => {
        const state = new storeClass.Value(
          { events: [defaultEvent], areEventsDraggable: false },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
      });

      it('should return false when the event is read-only', () => {
        const state = new storeClass.Value(
          { events: [readOnlyEvent], areEventsDraggable: true },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
      });

      it('should return false when the calendar is read-only', () => {
        const state = new storeClass.Value(
          { events: [defaultEvent], areEventsDraggable: true, readOnly: true },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
      });

      it('should return false when the event start property is read-only', () => {
        const state = new storeClass.Value(
          {
            events: [defaultEvent],
            areEventsDraggable: true,
            eventModelStructure: {
              start: { getter: (event) => event.start },
            },
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
      });

      it('should return false when the event end property is read-only', () => {
        const state = new storeClass.Value(
          {
            events: [defaultEvent],
            areEventsDraggable: true,
            eventModelStructure: {
              end: { getter: (event) => event.end },
            },
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
      });

      it('should return true when areEventsDraggable is true and the event is not read-only', () => {
        const state = new storeClass.Value(
          { events: [defaultEvent], areEventsDraggable: true },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
      });

      it('should return true when resource.areEventsDraggable is true and event has no draggable property', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('resource-1').build()],
            resources: [{ id: 'resource-1', title: 'Resource 1', areEventsDraggable: true }],
            areEventsDraggable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
      });

      it('should return false when resource.areEventsDraggable is false and event has no draggable property', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('resource-1').build()],
            resources: [{ id: 'resource-1', title: 'Resource 1', areEventsDraggable: false }],
            areEventsDraggable: true,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
      });

      it('should use event.draggable over resource.areEventsDraggable when both are defined', () => {
        const state = new storeClass.Value(
          {
            events: [
              EventBuilder.new().id('event-1').resource('resource-1').draggable(true).build(),
            ],
            resources: [{ id: 'resource-1', title: 'Resource 1', areEventsDraggable: false }],
            areEventsDraggable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
      });

      it('should return false when event.draggable is false even if resource.areEventsDraggable is true', () => {
        const state = new storeClass.Value(
          {
            events: [
              EventBuilder.new().id('event-1').resource('resource-1').draggable(false).build(),
            ],
            resources: [{ id: 'resource-1', title: 'Resource 1', areEventsDraggable: true }],
            areEventsDraggable: true,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
      });

      it('should fall back to areEventsDraggable when resource has no areEventsDraggable property', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('resource-1').build()],
            resources: [{ id: 'resource-1', title: 'Resource 1' }],
            areEventsDraggable: true,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
      });

      it('should inherit areEventsDraggable from ancestor resource when child resource does not define it', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('child-resource').build()],
            resources: [
              {
                id: 'parent-resource',
                title: 'Parent Resource',
                areEventsDraggable: true,
                children: [{ id: 'child-resource', title: 'Child Resource' }],
              },
            ],
            areEventsDraggable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
      });

      it('should use child resource areEventsDraggable over parent resource when both are defined', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('child-resource').build()],
            resources: [
              {
                id: 'parent-resource',
                title: 'Parent Resource',
                areEventsDraggable: true,
                children: [
                  { id: 'child-resource', title: 'Child Resource', areEventsDraggable: false },
                ],
              },
            ],
            areEventsDraggable: true,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
      });

      it('should inherit areEventsDraggable from grandparent resource when parent and child do not define it', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('grandchild-resource').build()],
            resources: [
              {
                id: 'grandparent-resource',
                title: 'Grandparent Resource',
                areEventsDraggable: true,
                children: [
                  {
                    id: 'parent-resource',
                    title: 'Parent Resource',
                    children: [{ id: 'grandchild-resource', title: 'Grandchild Resource' }],
                  },
                ],
              },
            ],
            areEventsDraggable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
      });
    });

    describe('isResizable', () => {
      it('should return false when areEventsResizable is not defined', () => {
        const state = new storeClass.Value(
          { events: [defaultEvent], areEventsResizable: undefined },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should return false when areEventsResizable is false', () => {
        const state = new storeClass.Value(
          { events: [defaultEvent], areEventsResizable: false },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should return false when the event is read-only', () => {
        const state = new storeClass.Value(
          { events: [readOnlyEvent], areEventsResizable: true },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should return false when the calendar is read-only', () => {
        const state = new storeClass.Value(
          { events: [defaultEvent], areEventsResizable: true, readOnly: true },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should return false for the "start" side when the event start property is read-only', () => {
        const state = new storeClass.Value(
          {
            events: [defaultEvent],
            areEventsResizable: true,
            eventModelStructure: {
              start: { getter: (event) => event.start },
            },
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
      });

      it('should return false for the "end" side when the event end property is read-only', () => {
        const state = new storeClass.Value(
          {
            events: [defaultEvent],
            areEventsResizable: true,
            eventModelStructure: {
              end: { getter: (event) => event.end },
            },
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should return true when areEventsResizable is true and the event is not read-only', () => {
        const state = new storeClass.Value(
          { events: [defaultEvent], areEventsResizable: true },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
      });

      it('should return true for the start side when areEventsResizable is "start" and the event is not read-only', () => {
        const state = new storeClass.Value(
          { events: [defaultEvent], areEventsResizable: 'start' },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should return true for the end side when areEventsResizable is "end" and the event is not read-only', () => {
        const state = new storeClass.Value(
          { events: [defaultEvent], areEventsResizable: 'end' },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
      });

      it('should return false when areEventsResizable is true but event.resizable is false', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resizable(false).build()],
            areEventsResizable: true,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should return true when areEventsResizable is false and event.resizable is true', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resizable(true).build()],
            areEventsResizable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
      });

      it('should return true for the start side when areEventsResizable is false and event.resizable is "start"', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resizable('start').build()],
            areEventsResizable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should return true for the end side when areEventsResizable is false and event.resizable is "end"', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resizable('end').build()],
            areEventsResizable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
      });

      it('should return true when resource.areEventsResizable is true and event has no resizable property', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('resource-1').build()],
            resources: [{ id: 'resource-1', title: 'Resource 1', areEventsResizable: true }],
            areEventsResizable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
      });

      it('should return false when resource.areEventsResizable is false and event has no resizable property', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('resource-1').build()],
            resources: [{ id: 'resource-1', title: 'Resource 1', areEventsResizable: false }],
            areEventsResizable: true,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should return true for start side when resource.areEventsResizable is "start" and event has no resizable property', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('resource-1').build()],
            resources: [{ id: 'resource-1', title: 'Resource 1', areEventsResizable: 'start' }],
            areEventsResizable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should return true for end side when resource.areEventsResizable is "end" and event has no resizable property', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('resource-1').build()],
            resources: [{ id: 'resource-1', title: 'Resource 1', areEventsResizable: 'end' }],
            areEventsResizable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
      });

      it('should use event.resizable over resource.areEventsResizable when both are defined', () => {
        const state = new storeClass.Value(
          {
            events: [
              EventBuilder.new().id('event-1').resource('resource-1').resizable(true).build(),
            ],
            resources: [{ id: 'resource-1', title: 'Resource 1', areEventsResizable: false }],
            areEventsResizable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
      });

      it('should return false when event.resizable is false even if resource.areEventsResizable is true', () => {
        const state = new storeClass.Value(
          {
            events: [
              EventBuilder.new().id('event-1').resource('resource-1').resizable(false).build(),
            ],
            resources: [{ id: 'resource-1', title: 'Resource 1', areEventsResizable: true }],
            areEventsResizable: true,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should fall back to areEventsResizable when resource has no areEventsResizable property', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('resource-1').build()],
            resources: [{ id: 'resource-1', title: 'Resource 1' }],
            areEventsResizable: true,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
      });

      it('should handle event.resizable "start" overriding resource.areEventsResizable "end"', () => {
        const state = new storeClass.Value(
          {
            events: [
              EventBuilder.new().id('event-1').resource('resource-1').resizable('start').build(),
            ],
            resources: [{ id: 'resource-1', title: 'Resource 1', areEventsResizable: 'end' }],
            areEventsResizable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should inherit areEventsResizable from ancestor resource when child resource does not define it', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('child-resource').build()],
            resources: [
              {
                id: 'parent-resource',
                title: 'Parent Resource',
                areEventsResizable: true,
                children: [{ id: 'child-resource', title: 'Child Resource' }],
              },
            ],
            areEventsResizable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
      });

      it('should use child resource areEventsResizable over parent resource when both are defined', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('child-resource').build()],
            resources: [
              {
                id: 'parent-resource',
                title: 'Parent Resource',
                areEventsResizable: true,
                children: [
                  { id: 'child-resource', title: 'Child Resource', areEventsResizable: false },
                ],
              },
            ],
            areEventsResizable: true,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });

      it('should inherit areEventsResizable from grandparent resource when parent and child do not define it', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('grandchild-resource').build()],
            resources: [
              {
                id: 'grandparent-resource',
                title: 'Grandparent Resource',
                areEventsResizable: true,
                children: [
                  {
                    id: 'parent-resource',
                    title: 'Parent Resource',
                    children: [{ id: 'grandchild-resource', title: 'Grandchild Resource' }],
                  },
                ],
              },
            ],
            areEventsResizable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
      });

      it('should inherit side-specific areEventsResizable from parent resource', () => {
        const state = new storeClass.Value(
          {
            events: [EventBuilder.new().id('event-1').resource('child-resource').build()],
            resources: [
              {
                id: 'parent-resource',
                title: 'Parent Resource',
                areEventsResizable: 'start',
                children: [{ id: 'child-resource', title: 'Child Resource' }],
              },
            ],
            areEventsResizable: false,
          },
          adapter,
        ).state;
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
        expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
      });
    });
  });
}
