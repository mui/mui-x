// Run the work even when the page never becomes idle, for example while other work keeps the task queue busy.
const IDLE_TIMEOUT = 100;
// After a timeout, yield after this many milliseconds so that a busy page gets no long task.
const TIMEOUT_WORK_BUDGET = 10;

export default function asyncWorker({
  work,
  tasks,
  done,
}: {
  work: () => void;
  tasks: { current: number };
  done: () => void;
}) {
  const myNonEssentialWork: IdleRequestCallback = (deadline) => {
    const timeoutBudgetEnd = deadline.didTimeout ? performance.now() + TIMEOUT_WORK_BUDGET : 0;
    // If there is a surplus time in the frame, or a timeout budget
    while (
      (deadline.timeRemaining() > 0 || performance.now() < timeoutBudgetEnd) &&
      tasks.current > 0
    ) {
      work();
    }

    if (tasks.current > 0) {
      requestIdleCallback(myNonEssentialWork, { timeout: IDLE_TIMEOUT });
    } else {
      done();
    }
  };

  // Don't use requestIdleCallback if the time is mock, better to run synchronously in such case.
  if (typeof requestIdleCallback === 'function' && !(requestIdleCallback as any).clock) {
    requestIdleCallback(myNonEssentialWork, { timeout: IDLE_TIMEOUT });
  } else {
    while (tasks.current > 0) {
      work();
    }
    done();
  }
}
