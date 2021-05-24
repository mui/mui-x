---
title: Data Grid - Events
components: DataGrid, XGrid
---

# Data Grid - Events [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-pro/)

<p class="description">The data grid emits events that can be subscribed to attach custom behavior.</p>

## Subscribing to events

You can subscribe to one of the [events emitted](/components/data-grid/events/#catalog-of-events) by calling `apiRef.current.subscribeEvent()` with the name of the event and a handler. The handler will be called with two arguments: a object with information related to the event and, optionally, a `React.SyntheticEvent` object if the event was emitted by a DOM element.

```tsx
/**
 * Allows to register a handler for an event.
 * @param event The name of event
 * @param handler The handler to be called
 * @param options Additional options for this listener
 * @returns A function to unsubscribe from this event
 */
subscribeEvent: (
  event: string,
  handler: (params: any, event?: React.SyntheticEvent) => void,
  options?: GridSubscribeEventOptions,
) => () => void;
```

The following demo shows how to subcribe to the `columnResize` event. Try it by resizing the columns.

{{"demo": "pages/components/data-grid/events/SubscribeToEvents.js", "bg": "inline", "defaultCodeOpen": false}}

## Catalog of events

{{"demo": "pages/components/data-grid/events/CatalogOfEvents.js", "bg": "inline", "hideToolbar": true}}
