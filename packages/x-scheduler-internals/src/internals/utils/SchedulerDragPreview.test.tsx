import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { act, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import {
  cancelDrag,
  createSchedulerRenderer,
  moveDragAndWait,
  startDrag,
} from 'test/utils/scheduler';
import { schedulerDayEventMoveKind, schedulerDropTargetKind } from './schedulerDrag';
import { SchedulerDragPreview } from './SchedulerDragPreview';

const PreviewContext = React.createContext('missing context');
const payload = { scope: Symbol('scheduler') };

function PreviewContent() {
  return <span>{React.useContext(PreviewContext)}</span>;
}

function Source({
  renderPreview,
  disabled,
}: {
  renderPreview: () => React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Draggable.Root kind={schedulerDayEventMoveKind} payload={payload} data-testid="source">
      Source
      <SchedulerDragPreview disabled={disabled}>{renderPreview}</SchedulerDragPreview>
    </Draggable.Root>
  );
}

function Fixture({
  showSource = true,
  disabled,
  renderPreview,
}: {
  showSource?: boolean;
  disabled?: boolean;
  renderPreview: () => React.ReactNode;
}) {
  return (
    <PreviewContext.Provider value="Custom preview">
      <Draggable.Provider>
        {showSource && <Source renderPreview={renderPreview} disabled={disabled} />}
        <Draggable.Target
          accept={schedulerDayEventMoveKind}
          kind={schedulerDropTargetKind}
          data-testid="target"
        />
      </Draggable.Provider>
    </PreviewContext.Provider>
  );
}

describe('Scheduler floating drag preview', () => {
  const { render } = createSchedulerRenderer();

  it('should keep context and switch visibility when entering and leaving Scheduler targets', async () => {
    const renderPreview = vi.fn(() => <PreviewContent />);
    render(<Fixture renderPreview={renderPreview} />);
    await act(async () => startDrag(screen.getByTestId('source')));
    const content = await screen.findByText('Custom preview');
    expect(content).toBeVisible();
    const initialRenderCount = renderPreview.mock.calls.length;

    await moveDragAndWait(screen.getByTestId('target'), { clientX: 100 });
    expect(content.parentElement!.style.visibility).toBe('hidden');
    await moveDragAndWait(document.body, { clientX: 200 });
    expect(content).toBeVisible();
    expect(renderPreview).toHaveBeenCalledTimes(initialRenderCount);

    cancelDrag();
    await waitFor(() => expect(screen.queryByText('Custom preview')).toBe(null));
  });

  it('should keep the floating preview when virtualization unmounts the source', async () => {
    const renderPreview = () => <PreviewContent />;
    const view = render(<Fixture renderPreview={renderPreview} />);
    await act(async () => startDrag(screen.getByTestId('source')));
    await screen.findByText('Custom preview');
    view.setProps({ showSource: false });
    expect(screen.queryByTestId('source')).toBe(null);
    await moveDragAndWait(document.body, { clientX: 200 });
    expect(screen.getByText('Custom preview')).toBeVisible();
    cancelDrag();
    await waitFor(() => expect(screen.queryByText('Custom preview')).toBe(null));
  });

  it('should show no preview when disabled, and still run the drag', async () => {
    const renderPreview = vi.fn(() => <PreviewContent />);
    render(<Fixture renderPreview={renderPreview} disabled />);
    await act(async () => startDrag(screen.getByTestId('source')));
    await moveDragAndWait(screen.getByTestId('target'), { clientX: 100 });
    expect(screen.queryByText('Custom preview')).toBe(null);
    expect(renderPreview).not.toHaveBeenCalled();
    expect(screen.getByTestId('source').hasAttribute('data-dragging')).toBe(true);
  });

  it('should show no preview when the content is null, and still run the drag', async () => {
    render(<Fixture renderPreview={() => null} />);
    await act(async () => startDrag(screen.getByTestId('source')));
    await moveDragAndWait(document.body, { clientX: 200 });
    expect(document.querySelector('[data-drag-preview]')).toBe(null);
    expect(screen.getByTestId('source').hasAttribute('data-dragging')).toBe(true);
    cancelDrag();
  });
});
