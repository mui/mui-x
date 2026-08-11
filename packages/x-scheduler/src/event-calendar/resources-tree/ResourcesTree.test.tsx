import * as React from 'react';
import { spy } from 'sinon';
import { waitFor } from '@mui/internal-test-utils';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
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

  const getTreeItem = (container: HTMLElement, resourceId: string) =>
    container.querySelector(`[role="treeitem"][id$="-${resourceId}"]`) as HTMLElement | null;

  const getExpandToggle = (container: HTMLElement, resourceId: string) =>
    getTreeItem(container, resourceId)!.querySelector(
      `.${treeItemClasses.iconContainer}`,
    ) as HTMLElement;

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

  describe('collapse', () => {
    const buildNestedResources = () => {
      const child = ResourceBuilder.new().id('tennis').title('Tennis').build();
      const parent = ResourceBuilder.new().id('sport').title('Sport').children([child]).build();
      return [parent];
    };

    it('should expand parent resources by default', () => {
      const { container } = render(
        <EventCalendar events={[]} resources={buildNestedResources()} />,
      );

      expect(getTreeItem(container, 'sport')!.getAttribute('aria-expanded')).to.equal('true');
      expect(getTreeItem(container, 'tennis')).not.to.equal(null);
    });

    it('should collapse a parent from defaultCollapsedResources when uncontrolled', () => {
      const { container } = render(
        <EventCalendar
          events={[]}
          resources={buildNestedResources()}
          defaultCollapsedResources={{ sport: true }}
        />,
      );

      expect(getTreeItem(container, 'sport')!.getAttribute('aria-expanded')).to.equal('false');
      expect(getTreeItem(container, 'tennis')).to.equal(null);
    });

    it('should collapse a parent from the controlled collapsedResources', () => {
      const { container } = render(
        <EventCalendar
          events={[]}
          resources={buildNestedResources()}
          collapsedResources={{ sport: true }}
          onCollapsedResourcesChange={() => {}}
        />,
      );

      expect(getTreeItem(container, 'tennis')).to.equal(null);
    });

    it('should collapse on toggle click and call onCollapsedResourcesChange when uncontrolled', async () => {
      const onCollapsedResourcesChange = spy();
      const { user, container } = render(
        <EventCalendar
          events={[]}
          resources={buildNestedResources()}
          onCollapsedResourcesChange={onCollapsedResourcesChange}
        />,
      );

      await user.click(getExpandToggle(container, 'sport'));

      await waitFor(() => {
        expect(getTreeItem(container, 'tennis')).to.equal(null);
      });
      expect(onCollapsedResourcesChange.lastCall.firstArg).to.deep.equal({ sport: true });
    });

    it('should re-expand a collapsed parent when the toggle is clicked again', async () => {
      const { user, container } = render(
        <EventCalendar events={[]} resources={buildNestedResources()} />,
      );

      await user.click(getExpandToggle(container, 'sport'));
      await waitFor(() => {
        expect(getTreeItem(container, 'tennis')).to.equal(null);
      });

      await user.click(getExpandToggle(container, 'sport'));
      await waitFor(() => {
        expect(getTreeItem(container, 'tennis')).not.to.equal(null);
      });
    });

    it('should call onCollapsedResourcesChange without collapsing when controlled', async () => {
      const onCollapsedResourcesChange = spy();
      const { user, container } = render(
        <EventCalendar
          events={[]}
          resources={buildNestedResources()}
          collapsedResources={{}}
          onCollapsedResourcesChange={onCollapsedResourcesChange}
        />,
      );

      await user.click(getExpandToggle(container, 'sport'));

      // Controlled: the tree stays expanded until the prop changes, but the callback fires.
      expect(getTreeItem(container, 'tennis')).not.to.equal(null);
      expect(onCollapsedResourcesChange.lastCall.firstArg).to.deep.equal({ sport: true });
    });

    it('should collapse when the controlled collapsedResources prop changes', async () => {
      const resources = buildNestedResources();
      const { container, rerender } = render(
        <EventCalendar
          events={[]}
          resources={resources}
          collapsedResources={{}}
          onCollapsedResourcesChange={() => {}}
        />,
      );

      expect(getTreeItem(container, 'tennis')).not.to.equal(null);

      rerender(
        <EventCalendar
          events={[]}
          resources={resources}
          collapsedResources={{ sport: true }}
          onCollapsedResourcesChange={() => {}}
        />,
      );

      await waitFor(() => {
        expect(getTreeItem(container, 'tennis')).to.equal(null);
      });
    });
  });
});
