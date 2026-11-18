'use client';
import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import { DirectionProvider } from '@base-ui/react/direction-provider';

/**
 * Passes the theme direction to Base UI's `DirectionProvider`.
 */
export function SchedulerDirectionProvider(props: { children: React.ReactNode }) {
  const isRtl = useRtl();

  return <DirectionProvider direction={isRtl ? 'rtl' : 'ltr'}>{props.children}</DirectionProvider>;
}
