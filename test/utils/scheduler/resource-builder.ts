import {
  SchedulerResource,
  SchedulerResourceId,
  SchedulerEventColor,
  SchedulerEventSide,
} from '@mui/x-scheduler-headless/models';

/**
 * Minimal resource builder for tests.
 *
 * Builds a valid SchedulerResource with sensible defaults.
 */
export class ResourceBuilder {
  protected resource: SchedulerResource;

  protected constructor() {
    const id = crypto.randomUUID();
    this.resource = {
      id,
      title: `Resource ${id}`,
    };
  }

  /**
   * Create a new builder.
   */
  static new() {
    return new ResourceBuilder();
  }

  // ─────────────────────────────────────────────
  // Field setters
  // ─────────────────────────────────────────────

  id(id: SchedulerResourceId) {
    this.resource.id = id;
    return this;
  }

  title(title: string) {
    this.resource.title = title;
    return this;
  }

  eventColor(color: SchedulerEventColor) {
    this.resource.eventColor = color;
    return this;
  }

  areEventsDraggable(v = true) {
    this.resource.areEventsDraggable = v;
    return this;
  }

  areEventsResizable(v: boolean | SchedulerEventSide = true) {
    this.resource.areEventsResizable = v;
    return this;
  }

  areEventsReadOnly(v = true) {
    this.resource.areEventsReadOnly = v;
    return this;
  }

  children(children: SchedulerResource[]) {
    this.resource.children = children;
    return this;
  }

  build(): SchedulerResource {
    return this.resource;
  }
}
