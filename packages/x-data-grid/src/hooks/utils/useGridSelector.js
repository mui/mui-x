'use client';
import * as React from 'react';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { warnOnce } from '@mui/x-internals/warning';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useLazyRef } from './useLazyRef';
const defaultCompare = Object.is;
export const objectShallowCompare = fastObjectShallowCompare;
const arrayShallowCompare = (a, b) => {
    if (a === b) {
        return true;
    }
    return a.length === b.length && a.every((v, i) => v === b[i]);
};
export const argsEqual = (prev, curr) => {
    let fn = Object.is;
    if (curr instanceof Array) {
        fn = arrayShallowCompare;
    }
    else if (curr instanceof Object) {
        fn = objectShallowCompare;
    }
    return fn(prev, curr);
};
const createRefs = () => ({ state: null, equals: null, selector: null, args: undefined });
const EMPTY = [];
const emptyGetSnapshot = () => null;
export function useGridSelector(apiRef, selector, args = undefined, equals = defaultCompare) {
    if (!apiRef.current.state) {
        warnOnce([
            'MUI X: `useGridSelector` has been called before the initialization of the state.',
            'This hook can only be used inside the context of the grid.',
        ]);
    }
    const refs = useLazyRef(createRefs);
    const didInit = refs.current.selector !== null;
    const [state, setState] = React.useState(
    // We don't use an initialization function to avoid allocations
    (didInit ? null : selector(apiRef, args)));
    refs.current.state = state;
    refs.current.equals = equals;
    refs.current.selector = selector;
    const prevArgs = refs.current.args;
    refs.current.args = args;
    if (didInit && !argsEqual(prevArgs, args)) {
        const newState = refs.current.selector(apiRef, refs.current.args);
        if (!refs.current.equals(refs.current.state, newState)) {
            refs.current.state = newState;
            setState(newState);
        }
    }
    const subscribe = React.useCallback(() => {
        if (refs.current.subscription) {
            return null;
        }
        refs.current.subscription = apiRef.current.store.subscribe(() => {
            const newState = refs.current.selector(apiRef, refs.current.args);
            if (!refs.current.equals(refs.current.state, newState)) {
                refs.current.state = newState;
                setState(newState);
            }
        });
        return null;
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    EMPTY);
    const unsubscribe = React.useCallback(() => {
        // Fixes issue in React Strict Mode, where getSnapshot is not called
        if (!refs.current.subscription) {
            subscribe();
        }
        return () => {
            if (refs.current.subscription) {
                refs.current.subscription();
                refs.current.subscription = undefined;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, EMPTY);
    useSyncExternalStore(unsubscribe, subscribe, emptyGetSnapshot);
    return state;
}
