type AnyProps = Record<string, any>;

function isEventHandlerKey(key: string): boolean {
  return key.length > 2 && key.startsWith('on') && key[2] === key[2].toUpperCase();
}

/**
 * Merges multiple React props objects with proper event handler composition.
 *
 * - Event handlers (`on[A-Z]*`): chained left-to-right, stops if `event.defaultPrevented`
 * - `className`: concatenated with spaces
 * - `style`: merged left-to-right (later values override earlier)
 * - Other props: last value wins
 */
export function mergeReactProps<T extends AnyProps>(base: T, ...rest: (AnyProps | undefined)[]): T;
export function mergeReactProps(...propsList: (AnyProps | undefined)[]): AnyProps;
export function mergeReactProps(...propsList: (AnyProps | undefined)[]): AnyProps {
  const result: AnyProps = {};
  const eventHandlerMap = new Map<string, Array<(...args: any[]) => any>>();

  for (const props of propsList) {
    if (props == null) {
      continue;
    }

    for (const [key, value] of Object.entries(props)) {
      if (value === undefined) {
        continue;
      }

      if (isEventHandlerKey(key) && typeof value === 'function') {
        const handlers = eventHandlerMap.get(key) ?? [];
        handlers.push(value);
        eventHandlerMap.set(key, handlers);
      } else if (key === 'className') {
        result.className = result.className ? `${result.className} ${value}` : value;
      } else if (key === 'style') {
        result.style = { ...result.style, ...value };
      } else {
        result[key] = value;
      }
    }
  }

  for (const [key, handlers] of eventHandlerMap) {
    if (handlers.length === 1) {
      result[key] = handlers[0];
    } else {
      result[key] = (...args: any[]) => {
        for (const handler of handlers) {
          handler(...args);

          // If the first argument is a React event with defaultPrevented, stop chaining
          if (args[0] != null && typeof args[0] === 'object' && args[0].defaultPrevented) {
            break;
          }
        }
      };
    }
  }

  return result;
}
