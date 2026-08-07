import * as React from 'react';
import { spy } from 'sinon';
import { DateField } from '@mui/x-date-pickers/DateField';
import { createEvent, fireEvent, screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  expectFieldValue,
  getCleanedSelectedContent,
  buildFieldInteractions,
  adapterToUse,
} from 'test/utils/pickers';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DateField /> - Selection', () => {
  const { render } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({ render, Component: DateField });

  describe('Focus', () => {
    it('should select 1st section on mount (`autoFocus = true`)', () => {
      const view = renderWithProps({
        autoFocus: true,
      });
      expectFieldValue(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should select 1st section (`autoFocus = true`) with start separator', () => {
      const view = renderWithProps({
        autoFocus: true,
        format: `- ${adapterToUse.formats.year}`,
      });
      expectFieldValue(view.getSectionsContainer(), '- YYYY');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should not select 1st section on mount (`autoFocus = true` and `disabled = true`)', () => {
      const view = renderWithProps({
        autoFocus: true,
        disabled: true,
      });
      expectFieldValue(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('');
    });
  });

  describe('Click', () => {
    it('should select the clicked selection when the input is already focused', async () => {
      const view = renderWithProps({});

      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should not change the selection when clicking on the only already selected section', async () => {
      const view = renderWithProps({});

      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
    });

    it('should not select section on click (`disabled = true`)', async () => {
      const view = renderWithProps({
        disabled: true,
      });

      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('');
    });
  });

  describe('Click on a non-section element inside the field root', () => {
    it('should select a section when clicking on a non-section descendant of the field root', () => {
      const view = renderWithProps({});

      const sectionsContainer = view.getSectionsContainer();
      fireEvent.mouseDown(sectionsContainer);
      fireEvent.click(sectionsContainer);

      // JSDOM rects are 0x0, so `findClosestSectionIndexToPoint` deterministically
      // picks the first section. The actual closest-section math is covered by
      // the browser-only test below.
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should select the section directly under the click target', () => {
      const view = renderWithProps({});

      const yearSection = view.getSection(2);
      fireEvent.mouseDown(yearSection);
      fireEvent.click(yearSection);

      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should select the visually-containing section when clicking on a section separator', () => {
      // Regression guard: without explicit handling, the closest-by-distance
      // math could pick a different section than the one whose container
      // visually owns the separator. The section is identified from the
      // `[data-sectionindex]` ancestor, matching pre-PR Chromium-delegation
      // behavior, and resolved in mousedown so the user never sees the
      // first-section fallback flicker when the CSS user-modify gate
      // briefly bounces focus to the sections-container `tabindex=0`.
      //
      // We click the "/" after the *Day* section (data-sectionindex=1)
      // rather than the one after Month, so the test discriminates between
      // the `[data-sectionindex]` lookup (Day) and the closest-section
      // fallback under zero-sized JSDOM rects (which always returns 0 =
      // Month) -- if the `[data-sectionindex]` lookup were dropped, the
      // assertion would fail.
      const view = renderWithProps({ defaultValue: adapterToUse.date('2022-04-11') });

      const daySection = view.getSection(1);
      const slashAfterDay = daySection.parentElement!.querySelector<HTMLElement>(
        '.MuiPickersInputBase-sectionAfter',
      )!;
      expect(slashAfterDay.textContent).to.equal('/');

      fireEvent.mouseDown(slashAfterDay);
      fireEvent.click(slashAfterDay);

      expect(getCleanedSelectedContent()).to.equal('11');
    });

    it('should not select any section on mousedown when the field is disabled', () => {
      const view = renderWithProps({ disabled: true });

      const sectionsContainer = view.getSectionsContainer();
      fireEvent.mouseDown(sectionsContainer);
      fireEvent.click(sectionsContainer);

      expect(getCleanedSelectedContent()).to.equal('');
    });

    it('should not select any section on a non-primary mousedown (e.g. right-click)', () => {
      const view = renderWithProps({});

      const sectionsContainer = view.getSectionsContainer();
      // `button: 2` = secondary (right) mouse button. The early-return
      // prevents focus theft and lets the context menu fire normally.
      fireEvent.mouseDown(sectionsContainer, { button: 2 });

      expect(getCleanedSelectedContent()).to.equal('');
    });

    it('should not select any section when a capture-phase parent calls preventDefault on mousedown', () => {
      // Locks the `handleRootMouseDown` contract: an upstream `preventDefault`
      // (e.g. a capture-phase parent intentionally blocking field interaction,
      // or the clear/open buttons whose own handlers already preventDefault
      // before propagation) suppresses the section selection. Userland inline
      // `event.preventDefault()` from `onMouseDown` is intentionally *not*
      // honored as an opt-out -- see the comment in `handleRootMouseDown`.
      const view = renderWithProps({});

      const sectionsContainer = view.getSectionsContainer();
      const handler = (event: Event) => event.preventDefault();
      sectionsContainer.parentElement!.addEventListener('mousedown', handler, true);

      fireEvent.mouseDown(sectionsContainer);

      sectionsContainer.parentElement!.removeEventListener('mousedown', handler, true);
      expect(getCleanedSelectedContent()).to.equal('');
    });

    it('should prevent the default mousedown behavior when clicking the field padding', () => {
      // The padding belongs to the field root, outside the sections container.
      // Without `preventDefault` the browser blurs the focused section, and the
      // field visibly blurs and focuses again. The blur itself is a browser
      // default action, so only real pointer input reproduces it -- the e2e
      // suite covers that, and this locks the mechanism everywhere.
      const view = renderWithProps({});
      const fieldRoot = view.getSectionsContainer().parentElement!;

      const event = createEvent.mouseDown(fieldRoot);
      fireEvent(fieldRoot, event);

      expect(event.defaultPrevented).to.equal(true);
    });

    it('should not prevent the default mousedown behavior when clicking an adornment button', () => {
      // The adornments own their focus behavior: preventing the default here
      // would stop the button from taking the focus on click.
      renderWithProps({
        clearable: true,
        defaultValue: adapterToUse.date('2022-04-11'),
        // The ripple would start on mousedown and update state outside `act`.
        slotProps: { clearButton: { disableRipple: true } },
      });
      const clearButton = screen.getByRole('button', { name: 'Clear' });

      const event = createEvent.mouseDown(clearButton);
      fireEvent(clearButton, event);

      expect(event.defaultPrevented).to.equal(false);
    });

    it('should not prevent the default mousedown behavior when clicking a non-interactive adornment', () => {
      // The blank space check is the field root itself, not "anything that is
      // not a section". A consumer adornment stays untouched even when it
      // renders nothing focusable.
      renderWithProps({
        slotProps: {
          textField: {
            slotProps: { input: { startAdornment: <span data-testid="adornment">@</span> } },
          },
        },
      } as any);
      const adornment = screen.getByTestId('adornment');

      const event = createEvent.mouseDown(adornment);
      fireEvent(adornment, event);

      expect(event.defaultPrevented).to.equal(false);
    });

    it('should forward mousedown to a userland `onMouseDown` consumer', () => {
      const consumer = spy();
      const view = renderWithProps({ onMouseDown: consumer });

      fireEvent.mouseDown(view.getSectionsContainer());

      expect(consumer.callCount).to.equal(1);
      expect(consumer.lastCall.firstArg.type).to.equal('mousedown');
    });

    it('should not fire `onSelectedSectionsChange` more than once per section click', () => {
      // The `mousedown` handler now selects the section authoritatively for
      // pointer input, in addition to the section's own focus/click handlers.
      // The section container's `onClick` deduplicates against the resulting
      // selection so the public callback fires the same number of times as
      // before this handler existed: twice for a click on a new section
      // (mousedown + focus), once for a click on the already-selected section.
      const onSelectedSectionsChange = spy();
      const view = renderWithProps({ onSelectedSectionsChange });

      const year = view.getSection(2);
      fireEvent.mouseDown(year);
      fireEvent.click(year);
      expect(onSelectedSectionsChange.args).to.deep.equal([[2], [2]]);

      // Clicking the already-selected section fires exactly once.
      onSelectedSectionsChange.resetHistory();
      fireEvent.mouseDown(year);
      fireEvent.click(year);
      expect(onSelectedSectionsChange.args).to.deep.equal([[2]]);
    });

    it('should preserve the all-sections selection when clicking the sections container', async () => {
      const view = renderWithProps({});
      await view.selectSection('month');
      await view.user.keyboard('{Control>}a{/Control}');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      // `mousedown`'s closest-section path must early-return when the field is
      // in 'all' mode so the Ctrl+A behavior is preserved. This asserts the
      // synchronous outcome only: `handleClick`'s 'all' branch schedules its
      // cursor-positioning work in a 0-tick `setTimeout` that `fireEvent`
      // does not flush, so 'all' stays selected within the assertion window.
      const sectionsContainer = view.getSectionsContainer();
      fireEvent.mouseDown(sectionsContainer);
      fireEvent.click(sectionsContainer);

      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
    });

    // Chromium delegates focus from a non-contenteditable ancestor click onto
    // the nearest contenteditable descendant — but only for trusted pointer
    // events. We drive the click via Playwright (real pointer events) here;
    // synthetic React events don't trigger Chromium's native delegation, so
    // the test would pass vacuously without them.
    it.skipIf(isJSDOM)(
      'should not focus any section when clicking on an ancestor outside the field root',
      async () => {
        // `display: flex; width: 100%` lets the field keep its natural width
        // and leaves blank space to its right inside the wrapper. The center
        // of the wrapper (where userEvent clicks) lands in that blank space.
        render(
          <div data-testid="flex-wrapper" style={{ display: 'flex', width: '100%' }}>
            <DateField />
          </div>,
        );

        const { userEvent } = await import('@vitest/browser/context');
        await userEvent.click(screen.getByTestId('flex-wrapper'));

        expect(getCleanedSelectedContent()).to.equal('');
        expect(document.activeElement?.getAttribute('role')).not.to.equal('spinbutton');
      },
    );

    // The closest-section distance math relies on real `getBoundingClientRect`
    // layout, so JSDOM (where rects are 0x0) only ever picks index 0.
    // Fire on the sections container directly so the click target is not
    // inside any section span — that's the case where the closest-section
    // logic actually decides the outcome (section spans have their own
    // `onClick` handler that would otherwise win on the click bubble).
    it.skipIf(isJSDOM)('should focus the section closest to the click point', () => {
      const view = renderWithProps({});

      const sectionsContainer = view.getSectionsContainer();
      const spinbuttons = sectionsContainer.querySelectorAll<HTMLElement>('[role="spinbutton"]');
      const monthCenter =
        (spinbuttons[0].getBoundingClientRect().left +
          spinbuttons[0].getBoundingClientRect().right) /
        2;
      const dayCenter =
        (spinbuttons[1].getBoundingClientRect().left +
          spinbuttons[1].getBoundingClientRect().right) /
        2;
      const yearCenter =
        (spinbuttons[2].getBoundingClientRect().left +
          spinbuttons[2].getBoundingClientRect().right) /
        2;

      // Closer to Day than to Month or Year.
      const clientX = dayCenter + 1;
      expect(Math.abs(clientX - dayCenter)).to.be.lessThan(Math.abs(clientX - monthCenter));
      expect(Math.abs(clientX - dayCenter)).to.be.lessThan(Math.abs(clientX - yearCenter));

      fireEvent.mouseDown(sectionsContainer, { clientX });
      fireEvent.click(sectionsContainer, { clientX });

      expect(getCleanedSelectedContent()).to.equal('DD');
    });
  });

  // The sections container stretches to fill the field, so the area after the
  // last section is blank space that belongs to no section.
  // Browser-only, because JSDOM rects are 0x0: no click point can ever fall
  // outside the sections there. Events are dispatched with `fireEvent` on real
  // layout, like the closest-section test above. That covers the selection
  // logic; the `preventDefault` that stops Chromium from delegating focus on a
  // trusted click needs real pointer input, and is covered in `test/e2e`.
  describe.skipIf(isJSDOM)('Click on the blank space after the last section', () => {
    const getLastSectionRight = (sectionsContainer: HTMLElement) => {
      const sections = sectionsContainer.querySelectorAll<HTMLElement>('[data-sectionindex]');
      return sections[sections.length - 1].getBoundingClientRect().right;
    };

    const clickAt = (sectionsContainer: HTMLElement, clientX: number) => {
      fireEvent.mouseDown(sectionsContainer, { clientX });
      fireEvent.click(sectionsContainer, { clientX });
    };

    const clickBlankSpace = (sectionsContainer: HTMLElement) => {
      const containerRight = sectionsContainer.getBoundingClientRect().right;
      // Without blank space well clear of the tolerance band, every assertion
      // below would pass vacuously.
      expect(containerRight).to.be.greaterThan(getLastSectionRight(sectionsContainer) + 16);

      clickAt(sectionsContainer, containerRight - 2);
    };

    it('should select the first section when the field is not focused', () => {
      const view = renderWithProps({});

      clickBlankSpace(view.getSectionsContainer());

      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should keep the selected section when the field is already focused', async () => {
      const onSelectedSectionsChange = spy();
      const view = renderWithProps({ onSelectedSectionsChange });
      await view.selectSection('day');
      onSelectedSectionsChange.resetHistory();

      clickBlankSpace(view.getSectionsContainer());

      expect(getCleanedSelectedContent()).to.equal('DD');
      expect(onSelectedSectionsChange.callCount).to.equal(0);
    });

    it('should select the last section when clicking just inside its right edge', () => {
      // Pins the boundary of the blank space: the last rendered character still
      // selects the year.
      const view = renderWithProps({});
      const sectionsContainer = view.getSectionsContainer();

      clickAt(sectionsContainer, getLastSectionRight(sectionsContainer) - 1);

      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should select the last section when the click misses it by less than the tolerance', async () => {
      // A sloppy click a couple of pixels past the year still means the year,
      // rather than a blank space click that would leave the day selected.
      const view = renderWithProps({});
      await view.selectSection('day');
      const sectionsContainer = view.getSectionsContainer();

      clickAt(sectionsContainer, getLastSectionRight(sectionsContainer) + 2);

      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });
  });

  describe('key: Ctrl + A', () => {
    it('should select all sections', async () => {
      const view = renderWithProps({});
      await view.selectSection('month');
      await view.user.keyboard('{Control>}a{/Control}');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
    });

    it('should select all sections with start separator', async () => {
      const view = renderWithProps({
        format: `- ${adapterToUse.formats.year}`,
      });
      await view.selectSection('year');
      await view.user.keyboard('{Control>}a{/Control}');
      expect(getCleanedSelectedContent()).to.equal('- YYYY');
    });
  });

  describe('key: ArrowRight', () => {
    it('should move selection to the next section when one section is selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should stay on the current section when the last section is selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('year');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should select the last section when all the sections are selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('month');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should select the next section when editing after all the sections were selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('month');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      await view.user.keyboard('{ArrowDown}');
      expect(getCleanedSelectedContent()).to.equal('12');

      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('DD');
    });
  });

  describe('key: ArrowLeft', () => {
    it('should move selection to the previous section when one section is selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      await view.user.keyboard('{ArrowLeft}');
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should stay on the current section when the first section is selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
      await view.user.keyboard('{ArrowLeft}');
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should select the first section when all the sections are selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('month');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      await view.user.keyboard('{ArrowLeft}');
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should select the first section when `inputRef.current` is focused', () => {
      function TestCase() {
        const inputRef = React.useRef<HTMLInputElement>(null);
        return (
          <React.Fragment>
            <DateField inputRef={inputRef} />
            <button onClick={() => inputRef.current?.focus()}>Focus input</button>
          </React.Fragment>
        );
      }
      render(<TestCase />);

      fireEvent.click(screen.getByRole('button', { name: 'Focus input' }));

      expect(getCleanedSelectedContent()).to.equal('MM');
    });
  });
});
