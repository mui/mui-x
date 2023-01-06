const childProcess = require("child_process");

/**
 * @param {string} command A shell command to execute
 * @return {Promise<string>} A promise that resolve to the output of the shell command, or an error
 * @example const output = await execute("ls -alh");
 */
function execute(command) {
  /**
   * @param {Function} resolve A function that resolves the promise
   * @param {Function} reject A function that fails the promise
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
   */
  return new Promise((resolve, reject) => {
    /**
     * @param {Error} error An error triggered during the execution of the childProcess.exec command
     * @param {string|Buffer} standardOutput The result of the shell command execution
     * @param {string|Buffer} standardError The error resulting of the shell command execution
     * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
     */
    childProcess.exec(command, (error, standardOutput, standardError) => {
      if (error) {
        reject();

        return;
      }

      if (standardError) {
        reject(standardError);

        return;
      }

      resolve(standardOutput);
    });
  });
}

async function resolveGitRemoteUrl() {
  const result = await execute('git config --get remote.origin.url');
  // eslint-disable-next-line no-console
  console.info(result);
  if (result.includes('git@')) {
    return result.replace('git@', 'https://').replace('github.com:', 'github.com/');
  }
  return result;
}

module.exports = {
  execute,
  resolveGitRemoteUrl,
}