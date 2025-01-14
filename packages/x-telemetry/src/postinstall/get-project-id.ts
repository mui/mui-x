import { exec } from 'child_process';
import { createHash } from 'crypto';

async function execCLI(command: string): Promise<string | null> {
  try {
    const promise = new Promise<Buffer | string>((resolve, reject) => {
      exec(
        command,
        {
          timeout: 1000,
          windowsHide: true,
        },
        (error: null | Error, stdout: Buffer | string) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout);
        },
      );
    });

    return String(await promise).trim();
  } catch (_) {
    return null;
  }
}

// Q: Why does MUI need a project ID? Why is it looking at my git remote?
// A:
// MUI' telemetry is and always will anonimise this values. We need a way to
// differentiate different projects to track feature usage accurately.
// For example, to prevent a feature from appearing to be constantly `used`
// and then `unused` when switching between local projects.

async function getRawProjectId(): Promise<string> {
  return (
    (await execCLI(`git config --local --get remote.origin.url`)) ||
    process.env.REPOSITORY_URL ||
    (await execCLI(`git rev-parse --show-toplevel`)) ||
    process.cwd()
  );
}

export default async function getAnonymousProjectId(): Promise<string> {
  const rawProjectId = await getRawProjectId();
  return createHash('sha256').update(rawProjectId).digest('hex');
}
