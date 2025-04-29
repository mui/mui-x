import nodeMachineId from 'node-machine-id';
import { createHash } from 'crypto';

async function getRawMachineId(): Promise<string | null> {
  try {
    return await nodeMachineId.machineId(true);
  } catch (_) {
    return null;
  }
}

export default async function getAnonymousMachineId(): Promise<string | null> {
  const rawMachineId = await getRawMachineId().catch(() => null);
  if (!rawMachineId) {
    return null;
  }

  return createHash('sha256').update(rawMachineId).digest('hex');
}
