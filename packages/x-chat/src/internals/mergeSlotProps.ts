import type { SlotComponentProps } from '@mui/utils/types';
import clsx from 'clsx';
import type * as React from 'react';

type AnySlotProps = Record<string, any>;

function isEventHandlerKey(key: string): boolean {
  return key.length > 2 && key.startsWith('on') && key[2] === key[2].toUpperCase();
}

function isRefLike(value: unknown): value is React.Ref<unknown> {
  return typeof value === 'function' || (value != null && typeof value === 'object');
}

function setRef(ref: React.Ref<unknown>, value: unknown) {
  if (ref == null) {
    return;
  }
  if (typeof ref === 'function') {
    // Legacy callback-ref forwarding; a React 19 cleanup return is not propagated here.
    void ref(value);
    return;
  }

  (ref as React.MutableRefObject<unknown>).current = value;
}

function mergeRefs(
  baseRef: React.Ref<unknown> | undefined | null,
  consumerRef: React.Ref<unknown>,
) {
  if (baseRef == null) {
    return consumerRef;
  }

  return (value: unknown) => {
    setRef(baseRef, value);
    setRef(consumerRef, value);
  };
}

function mergeSx(baseSx: unknown, consumerSx: unknown): unknown {
  if (baseSx == null) {
    return consumerSx;
  }
  if (consumerSx == null) {
    return baseSx;
  }

  return [
    ...(Array.isArray(baseSx) ? baseSx : [baseSx]),
    ...(Array.isArray(consumerSx) ? consumerSx : [consumerSx]),
  ];
}

function mergeResolvedSlotProps(base: AnySlotProps, consumer: AnySlotProps): AnySlotProps {
  const result: AnySlotProps = { ...base };
  const eventHandlerMap = new Map<string, Array<(...args: any[]) => any>>();

  for (const source of [base, consumer]) {
    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) {
        continue;
      }

      if (isEventHandlerKey(key) && typeof value === 'function') {
        const handlers = eventHandlerMap.get(key) ?? [];
        handlers.push(value);
        eventHandlerMap.set(key, handlers);
      }
    }
  }

  for (const [key, value] of Object.entries(consumer)) {
    if (value === undefined) {
      continue;
    }

    if (isEventHandlerKey(key)) {
      // Function handlers are chained via `eventHandlerMap` below. A non-function
      // (e.g. `null`/`undefined`) handler from the consumer must not fall through
      // to the `else` branch and clobber the base handler.
      continue;
    }

    if (key === 'className') {
      result.className = clsx(base.className, value);
    } else if (key === 'sx') {
      result.sx = mergeSx(base.sx, value);
    } else if (key === 'style') {
      result.style = { ...(base.style ?? {}), ...(value ?? {}) };
    } else if (key === 'ownerState') {
      // Internal ownerState (e.g. the wrapper-computed `density`/`variant`) must
      // not be clobbered by a consumer-supplied slot prop; merge with the base
      // taking precedence on conflicting keys.
      result.ownerState = { ...(value as object), ...(base.ownerState as object) };
    } else if (key === 'ref') {
      // Only compose when the consumer ref is ref-like; a nullish/invalid ref
      // keeps `base.ref` rather than clobbering the internal ref with `null`.
      if (isRefLike(value)) {
        result.ref = mergeRefs(base.ref, value);
      }
    } else {
      result[key] = value;
    }
  }

  for (const [key, handlers] of eventHandlerMap) {
    result[key] =
      handlers.length === 1
        ? handlers[0]
        : (...args: any[]) => {
            for (const handler of handlers) {
              handler(...args);

              if (args[0] != null && typeof args[0] === 'object' && args[0].defaultPrevented) {
                break;
              }
            }
          };
  }

  return result;
}

/**
 * Merge a Material wrapper's default slot props (`base`, e.g. the resolved
 * `className`/`sx`) with a consumer-supplied slot prop, preserving the
 * `(ownerState) => props` **callback form** of `SlotComponentProps`.
 *
 * The Material chat components pre-compute their default slot props as a plain
 * object before handing them to the headless slot. Spreading the consumer slot
 * prop with `...(slotProps?.x as object)` silently flattens a callback to `{}`,
 * dropping owner-state-driven `className`/`sx`/handlers. A plain spread also
 * lets the consumer overwrite wrapper classes, top-level `sx`, refs, and
 * internal handlers. This helper keeps the callback form and merges React props
 * with the same rules used by slot utilities: class names concatenate, `sx`
 * layers are appended, styles merge, refs compose, handlers chain, and ordinary
 * props still let the consumer win.
 *
 * @param base Default props the wrapper always applies (e.g. `className`, `sx`).
 * @param consumer The consumer slot prop (object form, callback form, or undefined).
 */
export function mergeSlotProps<OwnerState>(
  base: AnySlotProps,
  consumer: SlotComponentProps<any, Record<string, unknown>, OwnerState> | undefined,
): AnySlotProps | ((ownerState: OwnerState) => AnySlotProps) {
  if (typeof consumer === 'function') {
    return (ownerState: OwnerState) =>
      mergeResolvedSlotProps(
        base,
        ((consumer as (os: OwnerState) => AnySlotProps | undefined)(ownerState) ??
          {}) as AnySlotProps,
      );
  }
  return mergeResolvedSlotProps(base, ((consumer as AnySlotProps) ?? {}) as AnySlotProps);
}
