import { createHash } from 'crypto';

export default async function getAnonymousMachineId(): Promise<string | null> {
  try {
    const nodeMachineId = await import('node-machine-id');
    const rawMachineId = await nodeMachineId.machineId(true);
    if (!rawMachineId) {
      return null;
    }

    return createHash('sha256').update(rawMachineId).digest('hex');
  } catch (_) {
    // Ignore any errors
    return null;
  }
}
