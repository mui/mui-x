import * as React from 'react';
import { DateField } from '@mui/x-date-pickers/DateField';
import type { FieldRef } from '@mui/x-date-pickers/models';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import { pickersSectionListClasses } from '@mui/x-date-pickers/PickersSectionList';
import { act } from '@mui/internal-test-utils';
import { createPickerRenderer, expectFieldValue } from 'test/utils/pickers';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, afterEach } from 'vitest';

// Regression tests for https://github.com/mui/mui-x/issues/24197
// When every section is filled but the date is invalid (month "00"), the field publishes the
// invalid date and must keep the sections the user typed when that value comes back.
// The typed sections used to be lost when something cleared the pending section update
// before the field rendered the published value.
describe('<DateField /> - Invalid date round trip', () => {
  const { render, adapter } = createPickerRenderer();

  const getSectionsContainer = () =>
    document.querySelector<HTMLDivElement>(`.${pickersSectionListClasses.root}`)!;

  const getSection = (sectionIndex: number) =>
    getSectionsContainer().querySelector<HTMLSpanElement>(
      `.${pickersSectionListClasses.section}[data-sectionindex="${sectionIndex}"] .${pickersSectionListClasses.sectionContent}`,
    )!;

  // Types a single character in a section the way the browser does on a contentEditable:
  // the DOM content changes, then an `input` event is dispatched. No `act()`, so React keeps
  // its real scheduling order.
  const typeInSection = (sectionIndex: number, character: string) => {
    const section = getSection(sectionIndex);
    section.textContent = character;
    section.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const selectSection = async (
    fieldRef: React.RefObject<FieldRef<PickerValue> | null>,
    sectionIndex: number,
  ) => {
    await act(async () => {
      fieldRef.current!.setSelectedSections(sectionIndex);
    });
    await act(async () => {
      getSection(sectionIndex).focus();
    });
  };

  afterEach(() => {
    vi.useRealTimers();
  });

  // The race needs React's real scheduling (a passive effect still pending when the key lands),
  // which `act()` would flush, so the key is dispatched outside of it.
  it.skipIf(!isJSDOM)(
    'should keep the typed sections when a passive effect of an earlier render runs before the published value is rendered',
    async () => {
      const fieldRef = React.createRef<FieldRef<PickerValue>>();
      let triggerNonUrgentRender: () => void = () => {};

      function Harness() {
        const [tick, setTick] = React.useState(0);
        triggerNonUrgentRender = () => setTick(1);

        React.useLayoutEffect(() => {
          if (tick === 1) {
            // Runs after the commit of the non-urgent render and before its passive effects.
            queueMicrotask(() => typeInSection(0, '0'));
          }
        }, [tick]);

        return (
          <DateField
            defaultValue={adapter.date('2026-05-15')}
            fieldRef={fieldRef}
            data-tick={tick}
          />
        );
      }

      render(<Harness />);
      await selectSection(fieldRef, 0);
      expectFieldValue(getSectionsContainer(), '05/15/2026');

      const previousActEnvironment = (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
      (globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
      try {
        // An update scheduled from a timer gets the default (non-sync) lane,
        // so React flushes its passive effects later, in a separate task.
        setTimeout(() => triggerNonUrgentRender());
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });
      } finally {
        (globalThis as any).IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
      }

      expectFieldValue(getSectionsContainer(), '00/15/2026');
    },
  );

  it('should keep the typed sections when a 0 ms timer runs before the published value is rendered', async () => {
    vi.useFakeTimers();
    const fieldRef = React.createRef<FieldRef<PickerValue>>();

    render(<DateField defaultValue={adapter.date('2026-05-15')} fieldRef={fieldRef} />);
    await selectSection(fieldRef, 0);
    expectFieldValue(getSectionsContainer(), '05/15/2026');

    // `act()` defers the render of the published value to its end,
    // so the pending 0 ms timers run first, as with a deferred parent update.
    await act(async () => {
      typeInSection(0, '0');
      vi.runOnlyPendingTimers();
    });

    expectFieldValue(getSectionsContainer(), '00/15/2026');
  });
});
