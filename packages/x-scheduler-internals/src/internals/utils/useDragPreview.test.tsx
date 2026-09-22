import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { act, screen, waitFor } from '@mui/internal-test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cancelDrag, createSchedulerRenderer, moveDrag, startDrag } from 'test/utils/scheduler';
import { schedulerExternalEventKind, schedulerDropTargetKind } from './schedulerDrag';
import { useDragPreview } from './useDragPreview';

const PreviewContext = React.createContext('missing context');
const payload = {
  source: 'StandaloneEvent' as const,
  eventId: 'external',
  occurrenceKey: 'external',
  eventData: { id: 'external', title: 'Event', duration: 60 },
};

function PreviewContent() {
  return <span>{React.useContext(PreviewContext)}</span>;
}

function Source({ renderPreview }: { renderPreview: () => React.ReactNode }) {
  const preview = useDragPreview({
    type: 'standalone-event',
    data: payload.eventData,
    renderDragPreview: renderPreview,
  });
  return (
    <Draggable.Root kind={schedulerExternalEventKind} payload={payload} data-testid="source">
      Source
      {preview.element}
    </Draggable.Root>
  );
}

function Fixture({
  showSource = true,
  renderPreview,
}: {
  showSource?: boolean;
  renderPreview: () => React.ReactNode;
}) {
  return (
    <PreviewContext.Provider value="Custom preview">
      <Draggable.Provider>
        {showSource && <Source renderPreview={renderPreview} />}
        <Draggable.Target
          accept={schedulerExternalEventKind}
          kind={schedulerDropTargetKind}
          payload={{ surfaceType: 'day-grid' }}
          data-testid="target"
        />
      </Draggable.Provider>
    </PreviewContext.Provider>
  );
}

async function moveTo(element: Element, clientX: number) {
  await act(async () => {
    moveDrag(element, { clientX });
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  });
}

describe('Scheduler floating drag preview', () => {
  const { render } = createSchedulerRenderer();
  afterEach(cancelDrag);

  it('keeps context and switches visibility when entering and leaving Scheduler targets', async () => {
    const renderPreview = vi.fn(() => <PreviewContent />);
    render(<Fixture renderPreview={renderPreview} />);
    await act(async () => startDrag(screen.getByTestId('source')));
    const content = await screen.findByText('Custom preview');
    expect(content).toBeVisible();
    const initialRenderCount = renderPreview.mock.calls.length;

    await moveTo(screen.getByTestId('target'), 100);
    expect(content.parentElement!.style.visibility).toBe('hidden');
    await moveTo(document.body, 200);
    expect(content).toBeVisible();
    expect(renderPreview).toHaveBeenCalledTimes(initialRenderCount);

    cancelDrag();
    await waitFor(() => expect(screen.queryByText('Custom preview')).toBe(null));
  });

  it('keeps the floating preview when virtualization unmounts the source', async () => {
    const renderPreview = () => <PreviewContent />;
    const view = render(<Fixture renderPreview={renderPreview} />);
    await act(async () => startDrag(screen.getByTestId('source')));
    await screen.findByText('Custom preview');
    view.setProps({ showSource: false });
    expect(screen.queryByTestId('source')).toBe(null);
    await moveTo(document.body, 200);
    expect(screen.getByText('Custom preview')).toBeVisible();
    cancelDrag();
    await waitFor(() => expect(screen.queryByText('Custom preview')).toBe(null));
  });
});
