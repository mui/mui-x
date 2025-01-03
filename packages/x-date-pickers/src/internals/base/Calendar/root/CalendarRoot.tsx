'use client';
import * as React from 'react';

const CalendarRoot = React.forwardRef(function CalendarRoot(
  props: CalendarRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  return <div>TEST</div>;
});

export namespace CalendarRoot {
  export interface State {}

  export interface Props {}
}

export { CalendarRoot };
