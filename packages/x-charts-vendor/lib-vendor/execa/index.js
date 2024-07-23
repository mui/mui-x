"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execa = execa;
exports.execaCommand = execaCommand;
exports.execaCommandSync = execaCommandSync;
exports.execaNode = execaNode;
exports.execaSync = execaSync;
var _nodeBuffer = require("node:buffer");
var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeChild_process = _interopRequireDefault(require("node:child_process"));
var _nodeProcess = _interopRequireDefault(require("node:process"));
var _crossSpawn = _interopRequireDefault(require("cross-spawn"));
var _stripFinalNewline = _interopRequireDefault(require("strip-final-newline"));
var _npmRunPath = require("npm-run-path");
var _onetime = _interopRequireDefault(require("onetime"));
var _error = require("./lib/error.js");
var _stdio = require("./lib/stdio.js");
var _kill = require("./lib/kill.js");
var _stream = require("./lib/stream.js");
var _promise = require("./lib/promise.js");
var _command = require("./lib/command.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;
const getEnv = ({
  env: envOption,
  extendEnv,
  preferLocal,
  localDir,
  execPath
}) => {
  const env = extendEnv ? {
    ..._nodeProcess.default.env,
    ...envOption
  } : envOption;
  if (preferLocal) {
    return (0, _npmRunPath.npmRunPathEnv)({
      env,
      cwd: localDir,
      execPath
    });
  }
  return env;
};
const handleArguments = (file, args, options = {}) => {
  const parsed = _crossSpawn.default._parse(file, args, options);
  file = parsed.command;
  args = parsed.args;
  options = parsed.options;
  options = {
    maxBuffer: DEFAULT_MAX_BUFFER,
    buffer: true,
    stripFinalNewline: true,
    extendEnv: true,
    preferLocal: false,
    localDir: options.cwd || _nodeProcess.default.cwd(),
    execPath: _nodeProcess.default.execPath,
    encoding: 'utf8',
    reject: true,
    cleanup: true,
    all: false,
    windowsHide: true,
    ...options
  };
  options.env = getEnv(options);
  options.stdio = (0, _stdio.normalizeStdio)(options);
  if (_nodeProcess.default.platform === 'win32' && _nodePath.default.basename(file, '.exe') === 'cmd') {
    // #116
    args.unshift('/q');
  }
  return {
    file,
    args,
    options,
    parsed
  };
};
const handleOutput = (options, value, error) => {
  if (typeof value !== 'string' && !_nodeBuffer.Buffer.isBuffer(value)) {
    // When `execaSync()` errors, we normalize it to '' to mimic `execa()`
    return error === undefined ? undefined : '';
  }
  if (options.stripFinalNewline) {
    return (0, _stripFinalNewline.default)(value);
  }
  return value;
};
function execa(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command = (0, _command.joinCommand)(file, args);
  const escapedCommand = (0, _command.getEscapedCommand)(file, args);
  (0, _kill.validateTimeout)(parsed.options);
  let spawned;
  try {
    spawned = _nodeChild_process.default.spawn(parsed.file, parsed.args, parsed.options);
  } catch (error) {
    // Ensure the returned error is always both a promise and a child process
    const dummySpawned = new _nodeChild_process.default.ChildProcess();
    const errorPromise = Promise.reject((0, _error.makeError)({
      error,
      stdout: '',
      stderr: '',
      all: '',
      command,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    }));
    return (0, _promise.mergePromise)(dummySpawned, errorPromise);
  }
  const spawnedPromise = (0, _promise.getSpawnedPromise)(spawned);
  const timedPromise = (0, _kill.setupTimeout)(spawned, parsed.options, spawnedPromise);
  const processDone = (0, _kill.setExitHandler)(spawned, parsed.options, timedPromise);
  const context = {
    isCanceled: false
  };
  spawned.kill = _kill.spawnedKill.bind(null, spawned.kill.bind(spawned));
  spawned.cancel = _kill.spawnedCancel.bind(null, spawned, context);
  const handlePromise = async () => {
    const [{
      error,
      exitCode,
      signal,
      timedOut
    }, stdoutResult, stderrResult, allResult] = await (0, _stream.getSpawnedResult)(spawned, parsed.options, processDone);
    const stdout = handleOutput(parsed.options, stdoutResult);
    const stderr = handleOutput(parsed.options, stderrResult);
    const all = handleOutput(parsed.options, allResult);
    if (error || exitCode !== 0 || signal !== null) {
      const returnedError = (0, _error.makeError)({
        error,
        exitCode,
        signal,
        stdout,
        stderr,
        all,
        command,
        escapedCommand,
        parsed,
        timedOut,
        isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
        killed: spawned.killed
      });
      if (!parsed.options.reject) {
        return returnedError;
      }
      throw returnedError;
    }
    return {
      command,
      escapedCommand,
      exitCode: 0,
      stdout,
      stderr,
      all,
      failed: false,
      timedOut: false,
      isCanceled: false,
      killed: false
    };
  };
  const handlePromiseOnce = (0, _onetime.default)(handlePromise);
  (0, _stream.handleInput)(spawned, parsed.options.input);
  spawned.all = (0, _stream.makeAllStream)(spawned, parsed.options);
  return (0, _promise.mergePromise)(spawned, handlePromiseOnce);
}
function execaSync(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command = (0, _command.joinCommand)(file, args);
  const escapedCommand = (0, _command.getEscapedCommand)(file, args);
  (0, _stream.validateInputSync)(parsed.options);
  let result;
  try {
    result = _nodeChild_process.default.spawnSync(parsed.file, parsed.args, parsed.options);
  } catch (error) {
    throw (0, _error.makeError)({
      error,
      stdout: '',
      stderr: '',
      all: '',
      command,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    });
  }
  const stdout = handleOutput(parsed.options, result.stdout, result.error);
  const stderr = handleOutput(parsed.options, result.stderr, result.error);
  if (result.error || result.status !== 0 || result.signal !== null) {
    const error = (0, _error.makeError)({
      stdout,
      stderr,
      error: result.error,
      signal: result.signal,
      exitCode: result.status,
      command,
      escapedCommand,
      parsed,
      timedOut: result.error && result.error.code === 'ETIMEDOUT',
      isCanceled: false,
      killed: result.signal !== null
    });
    if (!parsed.options.reject) {
      return error;
    }
    throw error;
  }
  return {
    command,
    escapedCommand,
    exitCode: 0,
    stdout,
    stderr,
    failed: false,
    timedOut: false,
    isCanceled: false,
    killed: false
  };
}
function execaCommand(command, options) {
  const [file, ...args] = (0, _command.parseCommand)(command);
  return execa(file, args, options);
}
function execaCommandSync(command, options) {
  const [file, ...args] = (0, _command.parseCommand)(command);
  return execaSync(file, args, options);
}
function execaNode(scriptPath, args, options = {}) {
  if (args && !Array.isArray(args) && typeof args === 'object') {
    options = args;
    args = [];
  }
  const stdio = (0, _stdio.normalizeStdioNode)(options);
  const defaultExecArgv = _nodeProcess.default.execArgv.filter(arg => !arg.startsWith('--inspect'));
  const {
    nodePath = _nodeProcess.default.execPath,
    nodeOptions = defaultExecArgv
  } = options;
  return execa(nodePath, [...nodeOptions, scriptPath, ...(Array.isArray(args) ? args : [])], {
    ...options,
    stdin: undefined,
    stdout: undefined,
    stderr: undefined,
    stdio,
    shell: false
  });
}