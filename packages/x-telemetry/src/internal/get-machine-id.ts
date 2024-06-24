import { machineId } from 'node-machine-id';
import { createHash } from 'crypto';

async function getRawMachineId(): Promise<string | null> {
  try {
    return await machineId(true);
  } catch (_) {
    return null;
  }
}

async function getAnonymousMachineId(): Promise<string | null> {
  const rawMachineId = await getRawMachineId();

  return rawMachineId ? createHash('sha256').update(rawMachineId).digest('hex') : rawMachineId;
}

export default getAnonymousMachineId;
