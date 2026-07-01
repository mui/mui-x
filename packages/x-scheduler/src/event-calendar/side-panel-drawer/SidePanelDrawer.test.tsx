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

  it('is closed by default and opens via the mobile menu button', () => {
    render(<EventCalendar events={[]} />);

    // The drawer is only mounted while open.
    expect(getDrawer()).to.equal(null);

    openDrawer();
    expect(getDrawer()).not.to.equal(null);
  });

  it('closes via the close button', async () => {
    render(<EventCalendar events={[]} />);
    openDrawer();

    const drawer = getDrawer()!;
    fireEvent.click(drawer.querySelector(`.${eventCalendarClasses.sidePanelDrawerCloseButton}`)!);

    await waitFor(() => expect(getDrawer()).to.equal(null));
  });

  it('lists the views and reflects the selection when one is picked', () => {
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

  it('expands and collapses the preferences options inline', async () => {
    render(<EventCalendar events={[]} />);
    openDrawer();

    const drawer = getDrawer()!;
    // The view list is present and the preferences options are collapsed by default.
    expect(drawer.querySelector(`.${eventCalendarClasses.sidePanelDrawerViewList}`)).not.to.equal(
      null,
    );
    expect(getPreferencesList()).to.equal(null);

    // Expand the preferences options inside the drawer.
    fireEvent.click(
      drawer.querySelector(`.${eventCalendarClasses.sidePanelDrawerPreferencesButton}`)!,
    );
    expect(getPreferencesList()).not.to.equal(null);

    // Collapse them again.
    fireEvent.click(
      drawer.querySelector(`.${eventCalendarClasses.sidePanelDrawerPreferencesButton}`)!,
    );
    await waitFor(() => expect(getPreferencesList()).to.equal(null));
  });
});
