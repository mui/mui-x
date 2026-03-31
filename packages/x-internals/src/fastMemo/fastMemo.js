import * as React from 'react';
import { fastObjectShallowCompare } from '../fastObjectShallowCompare';
export function fastMemo(component) {
    return React.memo(component, fastObjectShallowCompare);
}
