import * as React from 'react';
import { waitFor } from '@mui/internal-test-utils';
import { createSchedulerRenderer, ResourceBuilder } from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

describe('ResourcesTree', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-26') });

  const getCheckbox = (container: HTMLElement, resourceId: string) => {
    const treeItem = container.querySelector(
      `[role="treeitem"][id$="-${resourceId}"]`,
    ) as HTMLElement;
    return treeItem.querySelector('input[type="checkbox"]') as HTMLInputElement;
  };

  it('parent checkbox should be checked when all descendants are visible', () => {
    const child = ResourceBuilder.new().id('tennis').title('Tennis').build();
    const parent = ResourceBuilder.new().id('sport').title('Sport').children([child]).build();

    const { container } = render(<EventCalendar events={[]} resources={[parent]} />);

    expect(getCheckbox(container, 'sport').checked).to.equal(true);
    expect(getCheckbox(container, 'tennis').checked).to.equal(true);
  });

  it('clicking parent checkbox should toggle all descendants', async () => {
    const child = ResourceBuilder.new().id('tennis').title('Tennis').build();
    const parent = ResourceBuilder.new().id('sport').title('Sport').children([child]).build();

    const { user, container } = render(<EventCalendar events={[]} resources={[parent]} />);

    expect(getCheckbox(container, 'sport').checked).to.equal(true);
    expect(getCheckbox(container, 'tennis').checked).to.equal(true);

    // Uncheck parent
    await user.click(getCheckbox(container, 'sport'));
    await waitFor(() => {
      expect(getCheckbox(container, 'sport').checked).to.equal(false);
    });
    expect(getCheckbox(container, 'tennis').checked).to.equal(false);

    // Re-check parent
    await user.click(getCheckbox(container, 'sport'));
    await waitFor(() => {
      expect(getCheckbox(container, 'sport').checked).to.equal(true);
    });
    expect(getCheckbox(container, 'tennis').checked).to.equal(true);
  });

  it('clicking child checkbox should set parent to indeterminate', async () => {
    const child1 = ResourceBuilder.new().id('tennis').title('Tennis').build();
    const child2 = ResourceBuilder.new().id('swimming').title('Swimming').build();
    const parent = ResourceBuilder.new()
      .id('sport')
      .title('Sport')
      .children([child1, child2])
      .build();

    const { user, container } = render(<EventCalendar events={[]} resources={[parent]} />);

    expect(getCheckbox(container, 'sport').checked).to.equal(true);

    // Uncheck one child
    await user.click(getCheckbox(container, 'tennis'));
    await waitFor(() => {
      expect(getCheckbox(container, 'tennis').checked).to.equal(false);
    });
    expect(getCheckbox(container, 'swimming').checked).to.equal(true);
    expect(getCheckbox(container, 'sport').checked).to.equal(false);
    expect(getCheckbox(container, 'sport').getAttribute('data-indeterminate')).to.equal('true');
  });
});
