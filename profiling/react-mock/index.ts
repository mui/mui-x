import { Fragment } from './jsx-runtime';
export { Fragment } from './jsx-runtime';

const noop = () => {};

export function useState(valueOrFn: any) {
  const value = typeof valueOrFn === 'function' ? valueOrFn() : valueOrFn;
  return [value, noop];
}

export function useMemo(fn: any) {
  return fn();
}

export function useCallback(fn: any, _deps: any[]) {
  return fn;
}

export function useEffect(_effect: any, _deps: any[]) {}

export function useLayoutEffect(_effect: any, _deps: any[]) {}

export function createContext(defaultValue: any) {
  const c = {
    Provider: noop,
    Consumer: noop,
    defaultValue,
  };
  return c;
}

export function useContext(c: any) {
  return c.defaultValue;
}

export function createElement(t: any, p: any) {
  return {};
}
export function cloneElement(e: any) {
  return e;
}
export function isValidElement(e: any) {
  return true;
}

export const Children = {
  count: (children: any) => children.length,
  forEach: (_children: any, _fn: any, _thisArg?: any) => {},
  map: (children: any, _fn: any, _thisArg?: any) => children,
  only: (children: any) => children,
  toArray: (children: any) => children,
};

export function memo(fn: any) {
  return fn;
}

export function useRef(current: any) {
  return { current };
}

export function createRef(current: any) {
  return { current };
}

export const version = 18;

export function useImperativeHandle(ref: any, create: any) {
  return Object.assign(ref.current, create());
}

export function forwardRef(fn: any) {
  return fn;
}

export function useReducer(_reducer: any, initialArg: any, _init?: any) {
  return [initialArg, noop];
}

export function useDebugValue() {}

const ReactCurrentDispatcher = { current: null };
const ReactCurrentBatchConfig = { transition: null };
const ReactCurrentOwner = { current: null };
const ReactSharedInternals = {
  ReactCurrentDispatcher: ReactCurrentDispatcher,
  ReactCurrentBatchConfig: ReactCurrentBatchConfig,
  ReactCurrentOwner: ReactCurrentOwner,
};
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;

export class Component {
  constructor(props: any, context: any, updater: any) {
    (this as any).props = props;
    (this as any).context = context;
    (this as any).refs = {};
    (this as any).updater = updater || noop;
  }
}
export class PureComponent extends Component {}

export default {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  Component,
  PureComponent,
  useDebugValue,
  useReducer,
  Fragment,
  useImperativeHandle,
  forwardRef,
  version,
  memo,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  createRef,
  createContext,
  useContext,
  createElement,
  cloneElement,
  isValidElement,
  Children,
};
