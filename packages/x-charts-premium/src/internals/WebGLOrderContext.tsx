'use client';
import * as React from 'react';

/**
 * Provides the z-order index for a WebGL plot based on its position in `ChartsWebGLLayer`'s
 * children. The plugin sorts registered draw callbacks by this value on each flush, so the
 * render order matches JSX order even when plots unmount and remount.
 */
export const WebGLOrderContext = React.createContext<number>(0);
