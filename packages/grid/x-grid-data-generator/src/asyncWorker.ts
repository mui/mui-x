export default function asyncWorker({ work, tasks, done }) {
  function myNonEssentialWork(deadline) {
    // If there is a surplus time in the frame, or timeout
    while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && tasks.current > 0) {
      work();
    }

    if (tasks.current > 0) {
      requestIdleCallback(myNonEssentialWork);
    } else {
      done();
    }
  }

  // Don't use requestIdleCallback if the time is mock, better to run synchronously in such case.
  if (typeof requestIdleCallback === 'function' && !(requestIdleCallback as any).clock) {
    requestIdleCallback(myNonEssentialWork);
  } else {
    while (tasks.current > 0) {
      work();
    }
    done();
  }
}
