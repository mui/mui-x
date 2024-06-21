import { machineId } from 'node-machine-id';

async function getMachineId(): Promise<string | null> {
  try {
    return await machineId();
  } catch (_) {
    return null;
  }
}

export default getMachineId;
