interface MetadataOutput {
  commit: string;
  repository: string;
  date: string;
  timestamp: number;
  files: string[];
}

function main() {
  const files: string[] = JSON.parse(process.env.FILES || '[]');
  const commitSha = process.env.COMMIT_SHA || '';
  const repoName = process.env.REPO_NAME || '';

  const data: MetadataOutput = {
    commit: commitSha,
    repository: repoName,
    date: new Date().toISOString(),
    timestamp: Date.now(),
    files,
  };

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(data, null, 2));
}

main();
