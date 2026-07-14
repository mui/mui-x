import * as React from 'react';
import { within, waitFor } from '@mui/internal-test-utils';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { createSchedulerRenderer } from 'test/utils/scheduler';

describe('<SidePanelDrawer />', () => {
  const { render } = createSchedulerRenderer();

  // The compact/expanded switch (drawer vs. inline side panel) is driven by the root
  // container query at 550px. In browser mode the layout is real, so we constrain the
  // calendar below the breakpoint to render the actual compact drawer instead of asserting
  // on hidden nodes; jsdom ignores container queries and mounts both layouts regardless.
  function renderCompact(ui: React.ReactElement<any>) {
    return render(<div style={{ width: 400, height: 600 }}>{ui}</div>);
  }

  function getDrawer() {
    return document.querySelector<HTMLElement>(`.${eventCalendarClasses.sidePanelDrawer}`);
  }

  function getBackdrop() {
    return document.querySelector<HTMLElement>(`.${eventCalendarClasses.sidePanelDrawerBackdrop}`);
  }

  function getPreferencesList() {
    return document.querySelector<HTMLElement>(
      `.${eventCalendarClasses.sidePanelDrawerPreferencesList}`,
    );
  }

  function openDrawer(user: ReturnType<typeof render>['user']) {
    return user.click(
      document.querySelector(`.${eventCalendarClasses.headerToolbarCompactMenuButton}`)!,
    );
  }

  function expandPreferences(user: ReturnType<typeof render>['user']) {
    return user.click(
      getDrawer()!.querySelector(`.${eventCalendarClasses.sidePanelDrawerPreferencesButton}`)!,
    );
  }

  it('should be closed by default and open via the compact menu button', async () => {
    const { user } = renderCompact(<EventCalendar events={[]} />);

    // The drawer is only mounted while open.
    expect(getDrawer()).to.equal(null);

    await openDrawer(user);
    expect(getDrawer()).not.to.equal(null);
  });

  it('should close via the close button', async () => {
    const { user } = renderCompact(<EventCalendar events={[]} />);
    await openDrawer(user);

    const drawer = getDrawer()!;
    await user.click(drawer.querySelector(`.${eventCalendarClasses.sidePanelDrawerCloseButton}`)!);

    await waitFor(() => expect(getDrawer()).to.equal(null));
  });

  it('should close when the backdrop is clicked', async () => {
    const { user } = renderCompact(<EventCalendar events={[]} />);
    await openDrawer(user);
    expect(getDrawer()).not.to.equal(null);

    await user.click(getBackdrop()!);

    await waitFor(() => expect(getDrawer()).to.equal(null));
  });

  it('should close when the Escape key is pressed', async () => {
    const { user } = renderCompact(<EventCalendar events={[]} />);
    await openDrawer(user);
    expect(getDrawer()).not.to.equal(null);

    await user.keyboard('{Escape}');

    await waitFor(() => expect(getDrawer()).to.equal(null));
  });

  it('should list the views and reflect the selection when one is picked', async () => {
    const { user } = renderCompact(<EventCalendar events={[]} />);
    await openDrawer(user);

    const drawer = getDrawer()!;
    const options = within(drawer).getAllByRole('option');
    expect(options.map((option) => option.textContent)).to.deep.equal([
      'Day',
      'Week',
      'Month',
      'Agenda',
    ]);

    await user.click(within(drawer).getByRole('option', { name: 'Month' }));

    expect(within(getDrawer()!).getByRole('option', { name: 'Month' })).to.have.attribute(
      'aria-selected',
      'true',
    );
  });

  it('should not render the view list when a single view is available', async () => {
    const { user } = renderCompact(<EventCalendar events={[]} views={['week']} />);
    await openDrawer(user);

    expect(getDrawer()!.querySelector(`.${eventCalendarClasses.sidePanelDrawerViewList}`)).to.equal(
      null,
    );
  });

  it('should expand and collapse the preferences options inline', async () => {
    const { user } = renderCompact(<EventCalendar events={[]} />);
    await openDrawer(user);

    const drawer = getDrawer()!;
    // The view list is present and the preferences options are collapsed by default.
    expect(drawer.querySelector(`.${eventCalendarClasses.sidePanelDrawerViewList}`)).not.to.equal(
      null,
    );
    expect(getPreferencesList()).to.equal(null);

    // Expand the preferences options inside the drawer.
    await expandPreferences(user);
    expect(getPreferencesList()).not.to.equal(null);

    // Collapse them again.
    await expandPreferences(user);
    await waitFor(() => expect(getPreferencesList()).to.equal(null));
  });

  it('should toggle a preference when its option is picked inside the drawer', async () => {
    const { user } = renderCompact(<EventCalendar events={[]} />);
    await openDrawer(user);
    await expandPreferences(user);

    const option = within(getPreferencesList()!).getByRole('menuitemcheckbox', {
      name: /show weekends/i,
    });
    const initialChecked = option.getAttribute('aria-checked');

    await user.click(option);

    expect(
      within(getPreferencesList()!)
        .getByRole('menuitemcheckbox', { name: /show weekends/i })
        .getAttribute('aria-checked'),
    ).not.to.equal(initialChecked);
  });

  it('should not render the preferences section when the config is disabled', async () => {
    const { user } = renderCompact(<EventCalendar events={[]} preferencesMenuConfig={false} />);
    await openDrawer(user);

    expect(
      getDrawer()!.querySelector(`.${eventCalendarClasses.sidePanelDrawerPreferencesButton}`),
    ).to.equal(null);
  });
});
