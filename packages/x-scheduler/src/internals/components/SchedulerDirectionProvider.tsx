'use client';
import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import { DirectionProvider } from '@base-ui/react/direction-provider';

/**
 * Passes the theme direction to the headless primitives, which read it with Base UI's `useDirection()`.
 */
export function SchedulerDirectionProvider(props: { children: React.ReactNode }) {
  const isRtl = useRtl();

  return <DirectionProvider direction={isRtl ? 'rtl' : 'ltr'}>{props.children}</DirectionProvider>;
}
