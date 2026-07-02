import { within, fireEvent, waitFor } from '@mui/internal-test-utils';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { createSchedulerRenderer } from 'test/utils/scheduler';

describe('<SidePanelDrawer />', () => {
  const { render } = createSchedulerRenderer();

  function getDrawer() {
    return document.querySelector<HTMLElement>(`.${eventCalendarClasses.sidePanelDrawer}`);
  }

  function getPreferencesList() {
    return document.querySelector<HTMLElement>(
      `.${eventCalendarClasses.sidePanelDrawerPreferencesList}`,
    );
  }

  function openDrawer() {
    fireEvent.click(
      document.querySelector(`.${eventCalendarClasses.headerToolbarMobileMenuButton}`)!,
    );
  }

  function expandPreferences() {
    fireEvent.click(
      getDrawer()!.querySelector(`.${eventCalendarClasses.sidePanelDrawerPreferencesButton}`)!,
    );
  }

  it('should be closed by default and open via the mobile menu button', () => {
    render(<EventCalendar events={[]} />);

    // The drawer is only mounted while open.
    expect(getDrawer()).to.equal(null);

    openDrawer();
    expect(getDrawer()).not.to.equal(null);
  });

  it('should close via the close button', async () => {
    render(<EventCalendar events={[]} />);
    openDrawer();

    const drawer = getDrawer()!;
    fireEvent.click(drawer.querySelector(`.${eventCalendarClasses.sidePanelDrawerCloseButton}`)!);

    await waitFor(() => expect(getDrawer()).to.equal(null));
  });

  it('should list the views and reflect the selection when one is picked', () => {
    render(<EventCalendar events={[]} />);
    openDrawer();

    const drawer = getDrawer()!;
    const options = within(drawer).getAllByRole('option', { hidden: true });
    expect(options.map((option) => option.textContent)).to.deep.equal([
      'Day',
      'Week',
      'Month',
      'Agenda',
    ]);

    fireEvent.click(within(drawer).getByRole('option', { name: 'Month', hidden: true }));

    expect(
      within(getDrawer()!).getByRole('option', { name: 'Month', hidden: true }),
    ).to.have.attribute('aria-selected', 'true');
  });

  it('should not render the view list when a single view is available', () => {
    render(<EventCalendar events={[]} views={['week']} />);
    openDrawer();

    expect(getDrawer()!.querySelector(`.${eventCalendarClasses.sidePanelDrawerViewList}`)).to.equal(
      null,
    );
  });

  it('should expand and collapse the preferences options inline', async () => {
    render(<EventCalendar events={[]} />);
    openDrawer();

    const drawer = getDrawer()!;
    // The view list is present and the preferences options are collapsed by default.
    expect(drawer.querySelector(`.${eventCalendarClasses.sidePanelDrawerViewList}`)).not.to.equal(
      null,
    );
    expect(getPreferencesList()).to.equal(null);

    // Expand the preferences options inside the drawer.
    expandPreferences();
    expect(getPreferencesList()).not.to.equal(null);

    // Collapse them again.
    expandPreferences();
    await waitFor(() => expect(getPreferencesList()).to.equal(null));
  });

  it('should toggle a preference when its option is picked inside the drawer', () => {
    render(<EventCalendar events={[]} />);
    openDrawer();
    expandPreferences();

    const option = within(getPreferencesList()!).getByRole('menuitemcheckbox', {
      name: /show weekends/i,
    });
    const initialChecked = option.getAttribute('aria-checked');

    fireEvent.click(option);

    expect(
      within(getPreferencesList()!)
        .getByRole('menuitemcheckbox', { name: /show weekends/i })
        .getAttribute('aria-checked'),
    ).not.to.equal(initialChecked);
  });

  it('should not render the preferences section when the config is disabled', () => {
    render(<EventCalendar events={[]} preferencesMenuConfig={false} />);
    openDrawer();

    expect(
      getDrawer()!.querySelector(`.${eventCalendarClasses.sidePanelDrawerPreferencesButton}`),
    ).to.equal(null);
  });

  // NOTE: The desktop/mobile switch (drawer vs. inline side panel) is driven by CSS
  // container queries, which jsdom does not evaluate. These tests exercise the drawer's
  // own behavior; the responsive show/hide toggling is not covered here.
});
