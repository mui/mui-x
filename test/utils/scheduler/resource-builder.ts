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
 * No adapter needed — resources have no date fields.
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

  /** Set a custom id. */
  id(id: SchedulerResourceId) {
    this.resource.id = id;
    return this;
  }

  /** Set the title. */
  title(title: string) {
    this.resource.title = title;
    return this;
  }

  /** Set the event color palette. */
  eventColor(color: SchedulerEventColor) {
    this.resource.eventColor = color;
    return this;
  }

  /** Mark events as draggable (defaults to true when called). */
  areEventsDraggable(v = true) {
    this.resource.areEventsDraggable = v;
    return this;
  }

  /** Set events resizable behavior (defaults to true when called). */
  areEventsResizable(v: boolean | SchedulerEventSide = true) {
    this.resource.areEventsResizable = v;
    return this;
  }

  /** Mark events as read-only (defaults to true when called). */
  areEventsReadOnly(v = true) {
    this.resource.areEventsReadOnly = v;
    return this;
  }

  /** Set child resources. Accepts builders or raw SchedulerResource objects. */
  children(children: Array<ResourceBuilder | SchedulerResource>) {
    this.resource.children = children.map((child) =>
      child instanceof ResourceBuilder ? child.build() : child,
    );
    return this;
  }

  // ─────────────────────────────────────────────
  // Accessors
  // ─────────────────────────────────────────────

  /** Lightweight accessor for the resource id (used by EventBuilder). */
  getId(): SchedulerResourceId {
    return this.resource.id;
  }

  // ─────────────────────────────────────────────
  // Build
  // ─────────────────────────────────────────────

  /** Returns the built SchedulerResource. */
  build(): SchedulerResource {
    return this.resource;
  }
}
