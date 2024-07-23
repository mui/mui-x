"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateTimeout = exports.spawnedKill = exports.spawnedCancel = exports.setupTimeout = exports.setExitHandler = void 0;
var _nodeOs = _interopRequireDefault(require("node:os"));
var _signalExit = _interopRequireDefault(require("signal-exit"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill = (kill, signal = 'SIGTERM', options = {}) => {
  const killResult = kill(signal);
  setKillTimeout(kill, signal, options, killResult);
  return killResult;
};
exports.spawnedKill = spawnedKill;
const setKillTimeout = (kill, signal, options, killResult) => {
  if (!shouldForceKill(signal, options, killResult)) {
    return;
  }
  const timeout = getForceKillAfterTimeout(options);
  const t = setTimeout(() => {
    kill('SIGKILL');
  }, timeout);

  // Guarded because there's no `.unref()` when `execa` is used in the renderer
  // process in Electron. This cannot be tested since we don't run tests in
  // Electron.
  // istanbul ignore else
  if (t.unref) {
    t.unref();
  }
};
const shouldForceKill = (signal, {
  forceKillAfterTimeout
}, killResult) => isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
const isSigterm = signal => signal === _nodeOs.default.constants.signals.SIGTERM || typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM';
const getForceKillAfterTimeout = ({
  forceKillAfterTimeout = true
}) => {
  if (forceKillAfterTimeout === true) {
    return DEFAULT_FORCE_KILL_TIMEOUT;
  }
  if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
    throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
  }
  return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel = (spawned, context) => {
  const killResult = spawned.kill();
  if (killResult) {
    context.isCanceled = true;
  }
};
exports.spawnedCancel = spawnedCancel;
const timeoutKill = (spawned, signal, reject) => {
  spawned.kill(signal);
  reject(Object.assign(new Error('Timed out'), {
    timedOut: true,
    signal
  }));
};

// `timeout` option handling
const setupTimeout = (spawned, {
  timeout,
  killSignal = 'SIGTERM'
}, spawnedPromise) => {
  if (timeout === 0 || timeout === undefined) {
    return spawnedPromise;
  }
  let timeoutId;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      timeoutKill(spawned, killSignal, reject);
    }, timeout);
  });
  const safeSpawnedPromise = spawnedPromise.finally(() => {
    clearTimeout(timeoutId);
  });
  return Promise.race([timeoutPromise, safeSpawnedPromise]);
};
exports.setupTimeout = setupTimeout;
const validateTimeout = ({
  timeout
}) => {
  if (timeout !== undefined && (!Number.isFinite(timeout) || timeout < 0)) {
    throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
  }
};

// `cleanup` option handling
exports.validateTimeout = validateTimeout;
const setExitHandler = async (spawned, {
  cleanup,
  detached
}, timedPromise) => {
  if (!cleanup || detached) {
    return timedPromise;
  }
  const removeExitHandler = (0, _signalExit.default)(() => {
    spawned.kill();
  });
  return timedPromise.finally(() => {
    removeExitHandler();
  });
};
exports.setExitHandler = setExitHandler;