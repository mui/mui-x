import {
  EventBuilder,
  ResourceBuilder,
  getEventCalendarStateFromParameters,
} from 'test/utils/scheduler';
import { schedulerEventSelectors } from './schedulerEventSelectors';
import { DEFAULT_EVENT_CREATION_CONFIG } from '../constants';

const defaultEvent = EventBuilder.new().build();
const readOnlyEvent = EventBuilder.new().id(defaultEvent.id).readOnly().build();

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
      expect(schedulerEventSelectors.isDraggable(state, defaultEvent.id)).to.equal(true);
    });

    it('should return false when areEventsDraggable is false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: false,
      });
      expect(schedulerEventSelectors.isDraggable(state, defaultEvent.id)).to.equal(false);
    });

    it('should return false when the event is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [readOnlyEvent],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, readOnlyEvent.id)).to.equal(false);
    });

    it('should return false when the calendar is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: true,
        readOnly: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, defaultEvent.id)).to.equal(false);
    });

    it('should return false when the event start property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: true,
        eventModelStructure: {
          start: { getter: (event) => event.start },
        },
      });
      expect(schedulerEventSelectors.isDraggable(state, defaultEvent.id)).to.equal(false);
    });

    it('should return false when the event end property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: true,
        eventModelStructure: {
          end: { getter: (event) => event.end },
        },
      });
      expect(schedulerEventSelectors.isDraggable(state, defaultEvent.id)).to.equal(false);
    });

    it('should return true when areEventsDraggable is true and the event is not read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, defaultEvent.id)).to.equal(true);
    });

    it('should return true when resource.areEventsDraggable is true and event has no draggable property', () => {
      const resource = ResourceBuilder.new().areEventsDraggable().build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsDraggable: false,
      });
      expect(schedulerEventSelectors.isDraggable(state, event.id)).to.equal(true);
    });

    it('should return false when resource.areEventsDraggable is false and event has no draggable property', () => {
      const resource = ResourceBuilder.new().areEventsDraggable(false).build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, event.id)).to.equal(false);
    });

    it('should use event.draggable over resource.areEventsDraggable when both are defined', () => {
      const resource = ResourceBuilder.new().areEventsDraggable(false).build();
      const event = EventBuilder.new().resource(resource).draggable(true).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsDraggable: false,
      });
      expect(schedulerEventSelectors.isDraggable(state, event.id)).to.equal(true);
    });

    it('should return false when event.draggable is false even if resource.areEventsDraggable is true', () => {
      const resource = ResourceBuilder.new().areEventsDraggable().build();
      const event = EventBuilder.new().resource(resource).draggable(false).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, event.id)).to.equal(false);
    });

    it('should fall back to areEventsDraggable when resource has no areEventsDraggable property', () => {
      const resource = ResourceBuilder.new().build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, event.id)).to.equal(true);
    });

    it('should inherit areEventsDraggable from ancestor resource when child resource does not define it', () => {
      const childResource = ResourceBuilder.new().build();
      const parentResource = ResourceBuilder.new()
        .areEventsDraggable()
        .children([childResource])
        .build();
      const event = EventBuilder.new().resource(childResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [parentResource],
        areEventsDraggable: false,
      });
      expect(schedulerEventSelectors.isDraggable(state, event.id)).to.equal(true);
    });

    it('should use child resource areEventsDraggable over parent resource when both are defined', () => {
      const childResource = ResourceBuilder.new().areEventsDraggable(false).build();
      const parentResource = ResourceBuilder.new()
        .areEventsDraggable()
        .children([childResource])
        .build();
      const event = EventBuilder.new().resource(childResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [parentResource],
        areEventsDraggable: true,
      });
      expect(schedulerEventSelectors.isDraggable(state, event.id)).to.equal(false);
    });

    it('should inherit areEventsDraggable from grandparent resource when parent and child do not define it', () => {
      const grandchildResource = ResourceBuilder.new().build();
      const parentResource = ResourceBuilder.new().children([grandchildResource]).build();
      const grandparentResource = ResourceBuilder.new()
        .areEventsDraggable()
        .children([parentResource])
        .build();
      const event = EventBuilder.new().resource(grandchildResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [grandparentResource],
        areEventsDraggable: false,
      });
      expect(schedulerEventSelectors.isDraggable(state, event.id)).to.equal(true);
    });
  });

  describe('isResizable', () => {
    it('should return true when areEventsResizable is not defined', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: undefined,
      });
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'end')).to.equal(true);
    });

    it('should return false when areEventsResizable is false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'end')).to.equal(false);
    });

    it('should return false when the event is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [readOnlyEvent],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, readOnlyEvent.id, 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, readOnlyEvent.id, 'end')).to.equal(false);
    });

    it('should return false when the calendar is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: true,
        readOnly: true,
      });
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'end')).to.equal(false);
    });

    it('should return false for the "start" side when the event start property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: true,
        eventModelStructure: {
          start: { getter: (event) => event.start },
        },
      });
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'end')).to.equal(true);
    });

    it('should return false for the "end" side when the event end property is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: true,
        eventModelStructure: {
          end: { getter: (event) => event.end },
        },
      });
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'end')).to.equal(false);
    });

    it('should return true when areEventsResizable is true and the event is not read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'end')).to.equal(true);
    });

    it('should return true for the start side when areEventsResizable is "start" and the event is not read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: 'start',
      });
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'end')).to.equal(false);
    });

    it('should return true for the end side when areEventsResizable is "end" and the event is not read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        areEventsResizable: 'end',
      });
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, defaultEvent.id, 'end')).to.equal(true);
    });

    it('should return false when areEventsResizable is true but event.resizable is false', () => {
      const event = EventBuilder.new().resizable(false).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(false);
    });

    it('should return true when areEventsResizable is false and event.resizable is true', () => {
      const event = EventBuilder.new().resizable(true).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(true);
    });

    it('should return true for the start side when areEventsResizable is false and event.resizable is "start"', () => {
      const event = EventBuilder.new().resizable('start').build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(false);
    });

    it('should return true for the end side when areEventsResizable is false and event.resizable is "end"', () => {
      const event = EventBuilder.new().resizable('end').build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(true);
    });

    it('should return true when resource.areEventsResizable is true and event has no resizable property', () => {
      const resource = ResourceBuilder.new().areEventsResizable().build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(true);
    });

    it('should return false when resource.areEventsResizable is false and event has no resizable property', () => {
      const resource = ResourceBuilder.new().areEventsResizable(false).build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(false);
    });

    it('should return true for start side when resource.areEventsResizable is "start" and event has no resizable property', () => {
      const resource = ResourceBuilder.new().areEventsResizable('start').build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(false);
    });

    it('should return true for end side when resource.areEventsResizable is "end" and event has no resizable property', () => {
      const resource = ResourceBuilder.new().areEventsResizable('end').build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(true);
    });

    it('should use event.resizable over resource.areEventsResizable when both are defined', () => {
      const resource = ResourceBuilder.new().areEventsResizable(false).build();
      const event = EventBuilder.new().resource(resource).resizable(true).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(true);
    });

    it('should return false when event.resizable is false even if resource.areEventsResizable is true', () => {
      const resource = ResourceBuilder.new().areEventsResizable().build();
      const event = EventBuilder.new().resource(resource).resizable(false).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(false);
    });

    it('should fall back to areEventsResizable when resource has no areEventsResizable property', () => {
      const resource = ResourceBuilder.new().build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(true);
    });

    it('should handle event.resizable "start" overriding resource.areEventsResizable "end"', () => {
      const resource = ResourceBuilder.new().areEventsResizable('end').build();
      const event = EventBuilder.new().resource(resource).resizable('start').build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(false);
    });

    it('should inherit areEventsResizable from ancestor resource when child resource does not define it', () => {
      const childResource = ResourceBuilder.new().build();
      const parentResource = ResourceBuilder.new()
        .areEventsResizable()
        .children([childResource])
        .build();
      const event = EventBuilder.new().resource(childResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [parentResource],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(true);
    });

    it('should use child resource areEventsResizable over parent resource when both are defined', () => {
      const childResource = ResourceBuilder.new().areEventsResizable(false).build();
      const parentResource = ResourceBuilder.new()
        .areEventsResizable()
        .children([childResource])
        .build();
      const event = EventBuilder.new().resource(childResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [parentResource],
        areEventsResizable: true,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(false);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(false);
    });

    it('should inherit areEventsResizable from grandparent resource when parent and child do not define it', () => {
      const grandchildResource = ResourceBuilder.new().build();
      const parentResource = ResourceBuilder.new().children([grandchildResource]).build();
      const grandparentResource = ResourceBuilder.new()
        .areEventsResizable()
        .children([parentResource])
        .build();
      const event = EventBuilder.new().resource(grandchildResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [grandparentResource],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(true);
    });

    it('should inherit side-specific areEventsResizable from parent resource', () => {
      const childResource = ResourceBuilder.new().build();
      const parentResource = ResourceBuilder.new()
        .areEventsResizable('start')
        .children([childResource])
        .build();
      const event = EventBuilder.new().resource(childResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [parentResource],
        areEventsResizable: false,
      });
      expect(schedulerEventSelectors.isResizable(state, event.id, 'start')).to.equal(true);
      expect(schedulerEventSelectors.isResizable(state, event.id, 'end')).to.equal(false);
    });
  });

  describe('color', () => {
    it('should return state eventColor when event has no color and no resource', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, defaultEvent.id)).to.equal('teal');
    });

    it('should return event color when event has a color', () => {
      const event = EventBuilder.new().color('red').build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, event.id)).to.equal('red');
    });

    it('should return resource eventColor when event has no color', () => {
      const resource = ResourceBuilder.new().eventColor('purple').build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, event.id)).to.equal('purple');
    });

    it('should use event color over resource eventColor when both are defined', () => {
      const resource = ResourceBuilder.new().eventColor('purple').build();
      const event = EventBuilder.new().resource(resource).color('red').build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, event.id)).to.equal('red');
    });

    it('should fall back to state eventColor when resource has no eventColor', () => {
      const resource = ResourceBuilder.new().build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, event.id)).to.equal('teal');
    });

    it('should inherit eventColor from ancestor resource when child resource does not define it', () => {
      const childResource = ResourceBuilder.new().build();
      const parentResource = ResourceBuilder.new()
        .eventColor('purple')
        .children([childResource])
        .build();
      const event = EventBuilder.new().resource(childResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [parentResource],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, event.id)).to.equal('purple');
    });

    it('should use child resource eventColor over parent resource when both are defined', () => {
      const childResource = ResourceBuilder.new().eventColor('blue').build();
      const parentResource = ResourceBuilder.new()
        .eventColor('purple')
        .children([childResource])
        .build();
      const event = EventBuilder.new().resource(childResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [parentResource],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, event.id)).to.equal('blue');
    });

    it('should inherit eventColor from grandparent resource when parent and child do not define it', () => {
      const grandchildResource = ResourceBuilder.new().build();
      const parentResource = ResourceBuilder.new().children([grandchildResource]).build();
      const grandparentResource = ResourceBuilder.new()
        .eventColor('purple')
        .children([parentResource])
        .build();
      const event = EventBuilder.new().resource(grandchildResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [grandparentResource],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, event.id)).to.equal('purple');
    });

    it('should use nearest ancestor eventColor over more distant ancestor', () => {
      const grandchildResource = ResourceBuilder.new().build();
      const parentResource = ResourceBuilder.new()
        .eventColor('blue')
        .children([grandchildResource])
        .build();
      const grandparentResource = ResourceBuilder.new()
        .eventColor('purple')
        .children([parentResource])
        .build();
      const event = EventBuilder.new().resource(grandchildResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [grandparentResource],
        eventColor: 'teal',
      });
      expect(schedulerEventSelectors.color(state, event.id)).to.equal('blue');
    });
  });

  describe('isReadOnly', () => {
    it('should return false by default', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
      });
      expect(schedulerEventSelectors.isReadOnly(state, defaultEvent.id)).to.equal(false);
    });

    it('should return true when the calendar is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [defaultEvent],
        readOnly: true,
      });
      expect(schedulerEventSelectors.isReadOnly(state, defaultEvent.id)).to.equal(true);
    });

    it('should return true when the event is read-only', () => {
      const state = getEventCalendarStateFromParameters({
        events: [readOnlyEvent],
      });
      expect(schedulerEventSelectors.isReadOnly(state, readOnlyEvent.id)).to.equal(true);
    });

    it('should return true when resource.areEventsReadOnly is true and event has no readOnly property', () => {
      const resource = ResourceBuilder.new().areEventsReadOnly().build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
      });
      expect(schedulerEventSelectors.isReadOnly(state, event.id)).to.equal(true);
    });

    it('should return false when resource.areEventsReadOnly is false and event has no readOnly property', () => {
      const resource = ResourceBuilder.new().areEventsReadOnly(false).build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
      });
      expect(schedulerEventSelectors.isReadOnly(state, event.id)).to.equal(false);
    });

    it('should use resource.areEventsReadOnly over component readOnly when both are defined', () => {
      const resource = ResourceBuilder.new().areEventsReadOnly(false).build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        readOnly: true,
      });
      expect(schedulerEventSelectors.isReadOnly(state, event.id)).to.equal(false);
    });

    it('should use event.readOnly over resource.areEventsReadOnly when both are defined', () => {
      const resource = ResourceBuilder.new().areEventsReadOnly(false).build();
      const event = EventBuilder.new().resource(resource).readOnly().build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
      });
      expect(schedulerEventSelectors.isReadOnly(state, event.id)).to.equal(true);
    });

    it('should fall back to component readOnly when resource has no areEventsReadOnly property', () => {
      const resource = ResourceBuilder.new().build();
      const event = EventBuilder.new().resource(resource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [resource],
        readOnly: true,
      });
      expect(schedulerEventSelectors.isReadOnly(state, event.id)).to.equal(true);
    });

    it('should use event.readOnly=false over component readOnly=true', () => {
      const event = EventBuilder.new().readOnly(false).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        readOnly: true,
      });
      expect(schedulerEventSelectors.isReadOnly(state, event.id)).to.equal(false);
    });

    it('should inherit areEventsReadOnly from ancestor resource when child resource does not define it', () => {
      const childResource = ResourceBuilder.new().build();
      const parentResource = ResourceBuilder.new()
        .areEventsReadOnly()
        .children([childResource])
        .build();
      const event = EventBuilder.new().resource(childResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [parentResource],
        readOnly: false,
      });
      expect(schedulerEventSelectors.isReadOnly(state, event.id)).to.equal(true);
    });

    it('should use child resource areEventsReadOnly over parent resource when both are defined', () => {
      const childResource = ResourceBuilder.new().areEventsReadOnly(false).build();
      const parentResource = ResourceBuilder.new()
        .areEventsReadOnly()
        .children([childResource])
        .build();
      const event = EventBuilder.new().resource(childResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [parentResource],
        readOnly: true,
      });
      expect(schedulerEventSelectors.isReadOnly(state, event.id)).to.equal(false);
    });

    it('should inherit areEventsReadOnly from grandparent resource when parent and child do not define it', () => {
      const grandchildResource = ResourceBuilder.new().build();
      const parentResource = ResourceBuilder.new().children([grandchildResource]).build();
      const grandparentResource = ResourceBuilder.new()
        .areEventsReadOnly()
        .children([parentResource])
        .build();
      const event = EventBuilder.new().resource(grandchildResource).build();
      const state = getEventCalendarStateFromParameters({
        events: [event],
        resources: [grandparentResource],
        readOnly: false,
      });
      expect(schedulerEventSelectors.isReadOnly(state, event.id)).to.equal(true);
    });
  });
});
