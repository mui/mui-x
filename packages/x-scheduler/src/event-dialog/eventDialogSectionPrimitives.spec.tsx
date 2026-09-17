import * as React from 'react';
import { EventDialogSectionFieldset } from './EventDialogSectionFieldset';
import { EventDialogSectionHeaderTitle } from './EventDialogSectionHeaderTitle';

// The wrappers are semantic (`fieldset`/`legend`) and their refs are typed to
// match, so the polymorphic `as` of the styled root is not exposed.
export function RejectedAsProp() {
  return (
    <React.Fragment>
      {/* @ts-expect-error the fieldset wrapper cannot change its element */}
      <EventDialogSectionFieldset as="div" />
      {/* @ts-expect-error the legend wrapper cannot change its element */}
      <EventDialogSectionHeaderTitle as="div" />
    </React.Fragment>
  );
}

export function AcceptedRefs() {
  const fieldsetRef = React.useRef<HTMLFieldSetElement>(null);
  const legendRef = React.useRef<HTMLLegendElement>(null);
  return (
    <React.Fragment>
      <EventDialogSectionFieldset ref={fieldsetRef} />
      <EventDialogSectionHeaderTitle ref={legendRef} />
    </React.Fragment>
  );
}
