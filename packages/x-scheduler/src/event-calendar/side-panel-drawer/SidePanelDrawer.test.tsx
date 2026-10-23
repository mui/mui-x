import * as React from 'react';
import { act, within, waitFor } from '@mui/internal-test-utils';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';

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

    // Same semantics and name as the toolbar's view switcher menu.
    const viewList = within(getDrawer()!).getByRole('menu', { name: 'Views' });
    const items = within(viewList).getAllByRole('menuitemradio');
    expect(items.map((item) => item.textContent)).to.deep.equal(['Day', 'Week', 'Month', 'Agenda']);
    expect(items.map((item) => item.getAttribute('aria-checked'))).to.deep.equal([
      'false',
      'true',
      'false',
      'false',
    ]);

    await user.click(within(viewList).getByRole('menuitemradio', { name: 'Month' }));

    expect(within(getDrawer()!).getByRole('menuitemradio', { name: 'Month' })).to.have.attribute(
      'aria-checked',
      'true',
    );
  });

  it('should not expose the view list as a listbox', async () => {
    const { user } = renderCompact(<EventCalendar events={[]} />);
    await openDrawer(user);

    const drawer = getDrawer()!;
    // A listbox implies arrow keys that change the selection, which the list doesn't do.
    expect(within(drawer).queryByRole('listbox')).to.equal(null);
    expect(within(drawer).queryAllByRole('option')).to.have.length(0);
  });

  it('should take the view list accessible name from the localeText', async () => {
    const { user } = renderCompact(
      <EventCalendar events={[]} localeText={{ viewSwitcherAriaLabel: 'Calendar views' }} />,
    );
    await openDrawer(user);

    const viewList = getDrawer()!.querySelector(`.${eventCalendarClasses.sidePanelDrawerViewList}`);
    expect(viewList).toHaveAccessibleName('Calendar views');
  });

  it('should move between the views with the arrow keys and pick one with Enter', async () => {
    const { user } = renderCompact(<EventCalendar events={[]} />);
    await openDrawer(user);

    const viewList = within(getDrawer()!).getByRole('menu', { name: 'Views' });
    act(() => {
      within(viewList).getByRole('menuitemradio', { name: 'Week' }).focus();
    });

    await user.keyboard('{ArrowUp}');
    expect(within(viewList).getByRole('menuitemradio', { name: 'Day' })).toHaveFocus();

    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(within(viewList).getByRole('menuitemradio', { name: 'Month' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(within(getDrawer()!).getByRole('menuitemradio', { name: 'Month' })).to.have.attribute(
      'aria-checked',
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
