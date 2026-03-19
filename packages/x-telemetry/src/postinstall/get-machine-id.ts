import { createHash } from 'crypto';
import fs from 'fs';
import os from 'os';

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

// Q: Why does MUI need a machine ID?
// A:
// MUI's telemetry uses a hashed machine ID to approximate unique developer counts.
// Without a stable machine ID, every session in containers or CI creates a new
// persona, inflating seat counts.
//
// Fallback chain:
// 1. node-machine-id — most reliable, uses platform-specific APIs
//    (IOPlatformUUID on macOS, MachineGuid on Windows, /var/lib/dbus/machine-id on Linux)
// 2. /etc/machine-id — present in most Linux distros and containers,
//    stable across container restarts (only changes on image rebuild)
// 3. /var/lib/dbus/machine-id — alternative Linux path, some distros
//    use this instead of /etc/machine-id
// 4. os.hostname() — last resort, only on macOS/Windows where hostnames
//    are typically user-set and stable. Skipped on Linux because container
//    runtimes (Docker, K8s) assign random hostnames per run, which would
//    create a different hash each session — worse than returning null.

export default async function getAnonymousMachineId(): Promise<string | null> {
  // 1. Try node-machine-id (platform-specific, most reliable)
  try {
    const nodeMachineId = await import('node-machine-id');
    const id = await nodeMachineId.machineId(true);
    if (id) {
      return sha256(id);
    }
  } catch {
    // Not available (e.g., sandboxed env, missing native deps)
  }

  // 2. Try /etc/machine-id (Linux, most containers)
  try {
    const id = fs.readFileSync('/etc/machine-id', 'utf-8').trim();
    if (id) {
      return sha256(id);
    }
  } catch {
    // File doesn't exist (macOS, Windows, or minimal container image)
  }

  // 3. Try /var/lib/dbus/machine-id (alternative Linux path)
  try {
    const id = fs.readFileSync('/var/lib/dbus/machine-id', 'utf-8').trim();
    if (id) {
      return sha256(id);
    }
  } catch {
    // File doesn't exist
  }

  // 4. Try hostname — only on macOS/Windows where it's user-set and stable.
  // On Linux, container runtimes assign random hostnames per run,
  // which would generate a different hash each session and inflate counts.
  if (process.platform !== 'linux') {
    try {
      const hostname = os.hostname();
      if (hostname) {
        return sha256(hostname);
      }
    } catch {
      // os.hostname() failed
    }
  }

  return null;
}
