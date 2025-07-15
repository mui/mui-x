import isDockerFunction from 'is-docker';
import ciEnvironment from 'ci-info';

interface EnvironmentInfo {
  isDocker: boolean;
  isCI: boolean;
}

let traits: EnvironmentInfo | undefined;

export default function getEnvironmentInfo(): EnvironmentInfo {
  if (!traits) {
    traits = {
      isDocker: isDockerFunction(),
      isCI: ciEnvironment.isCI,
    };
  }

  return traits;
}
