export default function asyncWorker({ work, tasks, done }) {
  function myNonEssentialWork(deadline) {
    // If there is a surplus time in the frame, or timeout
    while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && tasks.current > 0) {
      work();
    }

    if (tasks.current > 0) {
      // @ts-ignore
      requestIdleCallback(myNonEssentialWork);
    } else {
      done();
    }
  }

  // @ts-ignore
  if (typeof requestIdleCallback !== 'function') {
    // @ts-ignore
    requestIdleCallback(myNonEssentialWork);
  } else {
    while (tasks.current > 0) {
      work();
    }
    done();
  }
}
