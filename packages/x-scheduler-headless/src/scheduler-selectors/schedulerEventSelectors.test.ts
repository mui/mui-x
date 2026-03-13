import {
  EventBuilder,
  ResourceBuilder,
  getEventCalendarStateFromParameters,
} from 'test/utils/scheduler';
import { schedulerEventSelectors } from './schedulerEventSelectors';
import { DEFAULT_EVENT_CREATION_CONFIG } from '../constants';

const defaultEvent = EventBuilder.new().id('event-1').build();
const readOnlyEvent = EventBuilder.new().id('event-1').readOnly().build();

describe('schedulerEventSelectors', () => {
  describe('creationConfig', () => {
    it('should return the default config when props.eventCreation is not defined', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
      });
      expect(schedulerEventSelectors.creationConfig(state)).to.deep.equal(
        DEFAULT_EVENT_CREATION_CONFIG,
      );
    });

    it('should return false when props.eventCreation is false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        eventCreation: false,
      });
      expect(schedulerEventSelectors.creationConfig(state)).to.equal(false);
    });

    it('should return the default config when props.eventCreation is true', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        eventCreation: true,
      });
      expect(schedulerEventSelectors.creationConfig(state)).to.deep.equal(
        DEFAULT_EVENT_CREATION_CONFIG,
      );
    });

    it('should merge the default config with props.eventCreation when it is an object', () => {
      const customConfig = {
        duration: 60,
      };
      const state = getEventCalendarStateFromParameters({
        events: [],
        eventCreation: customConfig,
      });
      expect(schedulerEventSelectors.creationConfig(state)).to.deep.equal({
        ...DEFAULT_EVENT_CREATION_CONFIG,
        ...customConfig,
      });
    });

    it('should return false when the scheduler is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        readOnly: true,
        eventCreation: true,
      });
      expect(schedulerEventSelectors.creationConfig(state)).to.equal(false);
    });
  });

  describe('isDraggable', () => {
    it('should return true when areEventsDraggable is not defined', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: undefined,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
    });

    it('should return false when areEventsDraggable is false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: false,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when the event is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [readOnlyEvent],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when the calendar is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: true,
        readOnly: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when the event start property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: true,
        eventModelStructure: {
          start: { getter: (event) => event.start },
        },
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return false when the event end property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: true,
        eventModelStructure: {
          end: { getter: (event) => event.end },
        },
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should return true when areEventsDraggable is true and the event is not read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
    });

    it('should return true when resource.areEventsDraggable is true and event has no draggable property', () => {
      const r1 = ResourceBuilder.new().id('resource-1').title('Resource 1').areEventsDraggable().build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
        areEventsDraggable: false,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
    });

    it('should return false when resource.areEventsDraggable is false and event has no draggable property', () => {
      const r1 = ResourceBuilder.new()
        .id('resource-1')
        .title('Resource 1')
        .areEventsDraggable(false)
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should use event.draggable over resource.areEventsDraggable when both are defined', () => {
      const r1 = ResourceBuilder.new()
        .id('resource-1')
        .title('Resource 1')
        .areEventsDraggable(false)
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).draggable(true).build()],
        resources: [r1],
        areEventsDraggable: false,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
    });

    it('should return false when event.draggable is false even if resource.areEventsDraggable is true', () => {
      const r1 = ResourceBuilder.new().id('resource-1').title('Resource 1').areEventsDraggable().build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).draggable(false).build()],
        resources: [r1],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should fall back to areEventsDraggable when resource has no areEventsDraggable property', () => {
      const r1 = ResourceBuilder.new().id('resource-1').title('Resource 1').build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
    });

    it('should inherit areEventsDraggable from ancestor resource when child resource does not define it', () => {
      const childResource = ResourceBuilder.new().id('child-resource').title('Child Resource').build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .areEventsDraggable()
        .children([childResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(childResource).build()],
        resources: [parentResource],
        areEventsDraggable: false,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
    });

    it('should use child resource areEventsDraggable over parent resource when both are defined', () => {
      const childResource = ResourceBuilder.new()
        .id('child-resource')
        .title('Child Resource')
        .areEventsDraggable(false)
        .build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .areEventsDraggable()
        .children([childResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(childResource).build()],
        resources: [parentResource],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(false);
    });

    it('should inherit areEventsDraggable from grandparent resource when parent and child do not define it', () => {
      const grandchildResource = ResourceBuilder.new()
        .id('grandchild-resource')
        .title('Grandchild Resource')
        .build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .children([grandchildResource])
        .build();
      const grandparentResource = ResourceBuilder.new()
        .id('grandparent-resource')
        .title('Grandparent Resource')
        .areEventsDraggable()
        .children([parentResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(grandchildResource).build()],
        resources: [grandparentResource],
        areEventsDraggable: false,
      });
      expect(schedulerEventSelectors.isDraggable(state, 'event-1')).to.equal(true);
    });
  });

  describe('isResizable', () => {
    it('should return true when areEventsResizable is not defined', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: undefined,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should return false when areEventsResizable is false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return false when the event is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [readOnlyEvent],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return false when the calendar is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: true,
        readOnly: true,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return false for the "start" side when the event start property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: true,
        eventModelStructure: {
          start: { getter: (event) => event.start },
        },
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should return false for the "end" side when the event end property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: true,
        eventModelStructure: {
          end: { getter: (event) => event.end },
        },
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return true when areEventsResizable is true and the event is not read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should return true for the start side when areEventsResizable is "start" and the event is not read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: 'start',
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return true for the end side when areEventsResizable is "end" and the event is not read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: 'end',
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should return false when areEventsResizable is true but event.resizable is false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resizable(false).build()],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return true when areEventsResizable is false and event.resizable is true', () => {
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resizable(true).build()],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should return true for the start side when areEventsResizable is false and event.resizable is "start"', () => {
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resizable('start').build()],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return true for the end side when areEventsResizable is false and event.resizable is "end"', () => {
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resizable('end').build()],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should return true when resource.areEventsResizable is true and event has no resizable property', () => {
      const r1 = ResourceBuilder.new().id('resource-1').title('Resource 1').areEventsResizable().build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should return false when resource.areEventsResizable is false and event has no resizable property', () => {
      const r1 = ResourceBuilder.new()
        .id('resource-1')
        .title('Resource 1')
        .areEventsResizable(false)
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return true for start side when resource.areEventsResizable is "start" and event has no resizable property', () => {
      const r1 = ResourceBuilder.new()
        .id('resource-1')
        .title('Resource 1')
        .areEventsResizable('start')
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should return true for end side when resource.areEventsResizable is "end" and event has no resizable property', () => {
      const r1 = ResourceBuilder.new()
        .id('resource-1')
        .title('Resource 1')
        .areEventsResizable('end')
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should use event.resizable over resource.areEventsResizable when both are defined', () => {
      const r1 = ResourceBuilder.new()
        .id('resource-1')
        .title('Resource 1')
        .areEventsResizable(false)
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).resizable(true).build()],
        resources: [r1],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should return false when event.resizable is false even if resource.areEventsResizable is true', () => {
      const r1 = ResourceBuilder.new().id('resource-1').title('Resource 1').areEventsResizable().build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).resizable(false).build()],
        resources: [r1],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should fall back to areEventsResizable when resource has no areEventsResizable property', () => {
      const r1 = ResourceBuilder.new().id('resource-1').title('Resource 1').build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should handle event.resizable "start" overriding resource.areEventsResizable "end"', () => {
      const r1 = ResourceBuilder.new()
        .id('resource-1')
        .title('Resource 1')
        .areEventsResizable('end')
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).resizable('start').build()],
        resources: [r1],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should inherit areEventsResizable from ancestor resource when child resource does not define it', () => {
      const childResource = ResourceBuilder.new().id('child-resource').title('Child Resource').build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .areEventsResizable()
        .children([childResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(childResource).build()],
        resources: [parentResource],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should use child resource areEventsResizable over parent resource when both are defined', () => {
      const childResource = ResourceBuilder.new()
        .id('child-resource')
        .title('Child Resource')
        .areEventsResizable(false)
        .build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .areEventsResizable()
        .children([childResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(childResource).build()],
        resources: [parentResource],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });

    it('should inherit areEventsResizable from grandparent resource when parent and child do not define it', () => {
      const grandchildResource = ResourceBuilder.new()
        .id('grandchild-resource')
        .title('Grandchild Resource')
        .build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .children([grandchildResource])
        .build();
      const grandparentResource = ResourceBuilder.new()
        .id('grandparent-resource')
        .title('Grandparent Resource')
        .areEventsResizable()
        .children([parentResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(grandchildResource).build()],
        resources: [grandparentResource],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(true);
    });

    it('should inherit side-specific areEventsResizable from parent resource', () => {
      const childResource = ResourceBuilder.new().id('child-resource').title('Child Resource').build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .areEventsResizable('start')
        .children([childResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(childResource).build()],
        resources: [parentResource],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, 'event-1', 'end')).to.equal(false);
    });
  });

  describe('color', () => {
    it('should return state eventColor when event has no color and no resource', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, 'event-1')).to.equal('teal');
    });

    it('should return event color when event has a color', () => {
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').color('red').build()],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, 'event-1')).to.equal('red');
    });

    it('should return resource eventColor when event has no color', () => {
      const r1 = ResourceBuilder.new().id('resource-1').title('Resource 1').eventColor('purple').build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, 'event-1')).to.equal('purple');
    });

    it('should use event color over resource eventColor when both are defined', () => {
      const r1 = ResourceBuilder.new().id('resource-1').title('Resource 1').eventColor('purple').build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).color('red').build()],
        resources: [r1],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, 'event-1')).to.equal('red');
    });

    it('should fall back to state eventColor when resource has no eventColor', () => {
      const r1 = ResourceBuilder.new().id('resource-1').title('Resource 1').build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, 'event-1')).to.equal('teal');
    });

    it('should inherit eventColor from ancestor resource when child resource does not define it', () => {
      const childResource = ResourceBuilder.new().id('child-resource').title('Child Resource').build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .eventColor('purple')
        .children([childResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(childResource).build()],
        resources: [parentResource],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, 'event-1')).to.equal('purple');
    });

    it('should use child resource eventColor over parent resource when both are defined', () => {
      const childResource = ResourceBuilder.new()
        .id('child-resource')
        .title('Child Resource')
        .eventColor('blue')
        .build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .eventColor('purple')
        .children([childResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(childResource).build()],
        resources: [parentResource],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, 'event-1')).to.equal('blue');
    });

    it('should inherit eventColor from grandparent resource when parent and child do not define it', () => {
      const grandchildResource = ResourceBuilder.new()
        .id('grandchild-resource')
        .title('Grandchild Resource')
        .build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .children([grandchildResource])
        .build();
      const grandparentResource = ResourceBuilder.new()
        .id('grandparent-resource')
        .title('Grandparent Resource')
        .eventColor('purple')
        .children([parentResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(grandchildResource).build()],
        resources: [grandparentResource],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, 'event-1')).to.equal('purple');
    });

    it('should use nearest ancestor eventColor over more distant ancestor', () => {
      const grandchildResource = ResourceBuilder.new()
        .id('grandchild-resource')
        .title('Grandchild Resource')
        .build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .eventColor('blue')
        .children([grandchildResource])
        .build();
      const grandparentResource = ResourceBuilder.new()
        .id('grandparent-resource')
        .title('Grandparent Resource')
        .eventColor('purple')
        .children([parentResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(grandchildResource).build()],
        resources: [grandparentResource],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, 'event-1')).to.equal('blue');
    });
  });

  describe('isReadOnly', () => {
    it('should return false by default', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
      });
      expect(schedulerEventSelectors.isReadOnly(state, 'event-1')).to.equal(false);
    });

    it('should return true when the calendar is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        readOnly: true,
      });
      expect(schedulerEventSelectors.isReadOnly(state, 'event-1')).to.equal(true);
    });

    it('should return true when the event is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [readOnlyEvent],
      });
      expect(schedulerEventSelectors.isReadOnly(state, 'event-1')).to.equal(true);
    });

    it('should return true when resource.areEventsReadOnly is true and event has no readOnly property', () => {
      const r1 = ResourceBuilder.new().id('resource-1').title('Resource 1').areEventsReadOnly().build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
      });
      expect(schedulerEventSelectors.isReadOnly(state, 'event-1')).to.equal(true);
    });

    it('should return false when resource.areEventsReadOnly is false and event has no readOnly property', () => {
      const r1 = ResourceBuilder.new()
        .id('resource-1')
        .title('Resource 1')
        .areEventsReadOnly(false)
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
      });
      expect(schedulerEventSelectors.isReadOnly(state, 'event-1')).to.equal(false);
    });

    it('should use resource.areEventsReadOnly over component readOnly when both are defined', () => {
      const r1 = ResourceBuilder.new()
        .id('resource-1')
        .title('Resource 1')
        .areEventsReadOnly(false)
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
        readOnly: true,
      });
      expect(schedulerEventSelectors.isReadOnly(state, 'event-1')).to.equal(false);
    });

    it('should use event.readOnly over resource.areEventsReadOnly when both are defined', () => {
      const r1 = ResourceBuilder.new()
        .id('resource-1')
        .title('Resource 1')
        .areEventsReadOnly(false)
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).readOnly().build()],
        resources: [r1],
      });
      expect(schedulerEventSelectors.isReadOnly(state, 'event-1')).to.equal(true);
    });

    it('should fall back to component readOnly when resource has no areEventsReadOnly property', () => {
      const r1 = ResourceBuilder.new().id('resource-1').title('Resource 1').build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(r1).build()],
        resources: [r1],
        readOnly: true,
      });
      expect(schedulerEventSelectors.isReadOnly(state, 'event-1')).to.equal(true);
    });

    it('should use event.readOnly=false over component readOnly=true', () => {
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').readOnly(false).build()],
        readOnly: true,
      });
      expect(schedulerEventSelectors.isReadOnly(state, 'event-1')).to.equal(false);
    });

    it('should inherit areEventsReadOnly from ancestor resource when child resource does not define it', () => {
      const childResource = ResourceBuilder.new().id('child-resource').title('Child Resource').build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .areEventsReadOnly()
        .children([childResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(childResource).build()],
        resources: [parentResource],
        readOnly: false,
      });
      expect(schedulerEventSelectors.isReadOnly(state, 'event-1')).to.equal(true);
    });

    it('should use child resource areEventsReadOnly over parent resource when both are defined', () => {
      const childResource = ResourceBuilder.new()
        .id('child-resource')
        .title('Child Resource')
        .areEventsReadOnly(false)
        .build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .areEventsReadOnly()
        .children([childResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(childResource).build()],
        resources: [parentResource],
        readOnly: true,
      });
      expect(schedulerEventSelectors.isReadOnly(state, 'event-1')).to.equal(false);
    });

    it('should inherit areEventsReadOnly from grandparent resource when parent and child do not define it', () => {
      const grandchildResource = ResourceBuilder.new()
        .id('grandchild-resource')
        .title('Grandchild Resource')
        .build();
      const parentResource = ResourceBuilder.new()
        .id('parent-resource')
        .title('Parent Resource')
        .children([grandchildResource])
        .build();
      const grandparentResource = ResourceBuilder.new()
        .id('grandparent-resource')
        .title('Grandparent Resource')
        .areEventsReadOnly()
        .children([parentResource])
        .build();
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().id('event-1').resource(grandchildResource).build()],
        resources: [grandparentResource],
        readOnly: false,
      });
      expect(schedulerEventSelectors.isReadOnly(state, 'event-1')).to.equal(true);
    });
  });
});
