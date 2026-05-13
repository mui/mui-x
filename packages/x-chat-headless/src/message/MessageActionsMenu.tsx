'use client';
import * as React from 'react';
import { Menu } from '@base-ui/react/menu';

// ---------------------------------------------------------------------------
// MessageActionsMenu — Base UI Menu wrapped for use inside <MessageActions>.
//
// These are thin forward-ref wrappers that expose the full Base UI Menu API
// under the `MessageActionsMenu` (and `Message.ActionsMenu`) namespace.
//
// Why wrappers and not direct re-exports?
// - Consistent naming convention with the rest of x-chat-headless
// - Allows future extensibility (e.g. reading MessageContext, injecting
//   ownerState-derived props, adding data attributes)
// - Explicit public API surface that we control
//
// Accessibility provided by Base UI Menu:
// - `role="menu"` on MenuPopup, `role="menuitem"` on MenuItem
// - Full keyboard navigation: Arrow Up/Down, Home/End, Escape
// - Roving tabIndex focus management
// - `aria-haspopup="menu"` and `aria-expanded` on MenuTrigger
// - Focus restoration to trigger on close
// ---------------------------------------------------------------------------

/**
 * The root of a message action menu. Wraps Base UI `Menu.Root`.
 * Does not render an HTML element itself.
 *
 * Usage:
 * ```tsx
 * <MessageActionsMenu.Root>
 *   <MessageActionsMenu.Trigger>⋮</MessageActionsMenu.Trigger>
 *   <MessageActionsMenu.Positioner>
 *     <MessageActionsMenu.Popup>
 *       <MessageActionsMenu.Item onClick={handleCopy}>Copy</MessageActionsMenu.Item>
 *       <MessageActionsMenu.Item onClick={handleDelete}>Delete</MessageActionsMenu.Item>
 *     </MessageActionsMenu.Popup>
 *   </MessageActionsMenu.Positioner>
 * </MessageActionsMenu.Root>
 * ```
 */
export type MessageActionsMenuRootProps = Menu.Root.Props;

export function MessageActionsMenuRoot(props: MessageActionsMenuRootProps) {
  return <Menu.Root {...props} />;
}

// ---------------------------------------------------------------------------

/**
 * A button that opens the message action menu. Wraps Base UI `Menu.Trigger`.
 * Renders a `<button>` element.
 *
 * Automatically receives `aria-haspopup="menu"` and `aria-expanded` from
 * Base UI.
 */
export type MessageActionsMenuTriggerProps = Menu.Trigger.Props;

export const MessageActionsMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  MessageActionsMenuTriggerProps
>(function MessageActionsMenuTrigger(props, ref) {
  return <Menu.Trigger {...props} ref={ref} />;
});

// ---------------------------------------------------------------------------

/**
 * Positions the menu popup relative to the trigger.
 * Wraps Base UI `Menu.Positioner`. Renders a `<div>` element.
 *
 * Accepts all Base UI anchor-positioning props (`side`, `align`,
 * `sideOffset`, `alignOffset`, `collisionBoundary`, etc.).
 */
export type MessageActionsMenuPositionerProps = Menu.Positioner.Props;

export const MessageActionsMenuPositioner = React.forwardRef<
  HTMLDivElement,
  MessageActionsMenuPositionerProps
>(function MessageActionsMenuPositioner(props, ref) {
  return <Menu.Positioner {...props} ref={ref} />;
});

// ---------------------------------------------------------------------------

/**
 * The container for menu items. Wraps Base UI `Menu.Popup`.
 * Renders a `<div>` with `role="menu"`.
 */
export type MessageActionsMenuPopupProps = Menu.Popup.Props;

export const MessageActionsMenuPopup = React.forwardRef<
  HTMLDivElement,
  MessageActionsMenuPopupProps
>(function MessageActionsMenuPopup(props, ref) {
  return <Menu.Popup {...props} ref={ref} />;
});

// ---------------------------------------------------------------------------

/**
 * An individual action item inside the menu. Wraps Base UI `Menu.Item`.
 * Renders a `<div>` with `role="menuitem"`.
 *
 * Receives `data-highlighted` when focused via keyboard or pointer.
 */
export type MessageActionsMenuItemProps = Menu.Item.Props;

export const MessageActionsMenuItem = React.forwardRef<HTMLDivElement, MessageActionsMenuItemProps>(
  function MessageActionsMenuItem(props, ref) {
    return <Menu.Item {...props} ref={ref} />;
  },
);

// ---------------------------------------------------------------------------

/**
 * Groups a set of related menu items together.
 * Wraps Base UI `Menu.Group`. Renders a `<div>` element.
 */
export type MessageActionsMenuGroupProps = Menu.Group.Props;

export const MessageActionsMenuGroup = React.forwardRef<
  HTMLDivElement,
  MessageActionsMenuGroupProps
>(function MessageActionsMenuGroup(props, ref) {
  return <Menu.Group {...props} ref={ref} />;
});

// ---------------------------------------------------------------------------

/**
 * A label for a group of menu items.
 * Wraps Base UI `Menu.GroupLabel`. Renders a `<div>` element.
 */
export type MessageActionsMenuGroupLabelProps = Menu.GroupLabel.Props;

export const MessageActionsMenuGroupLabel = React.forwardRef<
  HTMLDivElement,
  MessageActionsMenuGroupLabelProps
>(function MessageActionsMenuGroupLabel(props, ref) {
  return <Menu.GroupLabel {...props} ref={ref} />;
});

// ---------------------------------------------------------------------------
// Convenience namespace object, mirrors Base UI's own pattern:
// `MessageActionsMenu.Root`, `.Trigger`, `.Positioner`, `.Popup`, `.Item`, …
// ---------------------------------------------------------------------------

export const MessageActionsMenu = {
  Root: MessageActionsMenuRoot,
  Trigger: MessageActionsMenuTrigger,
  Positioner: MessageActionsMenuPositioner,
  Popup: MessageActionsMenuPopup,
  Item: MessageActionsMenuItem,
  Group: MessageActionsMenuGroup,
  GroupLabel: MessageActionsMenuGroupLabel,
} as const;
