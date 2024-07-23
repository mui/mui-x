"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateInputSync = exports.makeAllStream = exports.handleInput = exports.getSpawnedResult = void 0;
var _isStream = require("is-stream");
var _getStream = _interopRequireDefault(require("get-stream"));
var _mergeStream = _interopRequireDefault(require("merge-stream"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// `input` option
const handleInput = (spawned, input) => {
  // Checking for stdin is workaround for https://github.com/nodejs/node/issues/26852
  // @todo remove `|| spawned.stdin === undefined` once we drop support for Node.js <=12.2.0
  if (input === undefined || spawned.stdin === undefined) {
    return;
  }
  if ((0, _isStream.isStream)(input)) {
    input.pipe(spawned.stdin);
  } else {
    spawned.stdin.end(input);
  }
};

// `all` interleaves `stdout` and `stderr`
exports.handleInput = handleInput;
const makeAllStream = (spawned, {
  all
}) => {
  if (!all || !spawned.stdout && !spawned.stderr) {
    return;
  }
  const mixed = (0, _mergeStream.default)();
  if (spawned.stdout) {
    mixed.add(spawned.stdout);
  }
  if (spawned.stderr) {
    mixed.add(spawned.stderr);
  }
  return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
exports.makeAllStream = makeAllStream;
const getBufferedData = async (stream, streamPromise) => {
  if (!stream) {
    return;
  }
  stream.destroy();
  try {
    return await streamPromise;
  } catch (error) {
    return error.bufferedData;
  }
};
const getStreamPromise = (stream, {
  encoding,
  buffer,
  maxBuffer
}) => {
  if (!stream || !buffer) {
    return;
  }
  if (encoding) {
    return (0, _getStream.default)(stream, {
      encoding,
      maxBuffer
    });
  }
  return _getStream.default.buffer(stream, {
    maxBuffer
  });
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult = async ({
  stdout,
  stderr,
  all
}, {
  encoding,
  buffer,
  maxBuffer
}, processDone) => {
  const stdoutPromise = getStreamPromise(stdout, {
    encoding,
    buffer,
    maxBuffer
  });
  const stderrPromise = getStreamPromise(stderr, {
    encoding,
    buffer,
    maxBuffer
  });
  const allPromise = getStreamPromise(all, {
    encoding,
    buffer,
    maxBuffer: maxBuffer * 2
  });
  try {
    return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
  } catch (error) {
    return Promise.all([{
      error,
      signal: error.signal,
      timedOut: error.timedOut
    }, getBufferedData(stdout, stdoutPromise), getBufferedData(stderr, stderrPromise), getBufferedData(all, allPromise)]);
  }
};
exports.getSpawnedResult = getSpawnedResult;
const validateInputSync = ({
  input
}) => {
  if ((0, _isStream.isStream)(input)) {
    throw new TypeError('The `input` option cannot be a stream in sync mode');
  }
};
exports.validateInputSync = validateInputSync;