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

  if (typeof requestIdleCallback !== 'function') {
    requestIdleCallback(myNonEssentialWork);
  } else {
    while (tasks.current > 0) {
      work();
    }
    done();
  }
}
