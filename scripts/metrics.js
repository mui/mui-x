/* eslint-disable no-console */
import { Octokit } from '@octokit/rest';
import { retry } from '@octokit/plugin-retry';
import fs from 'fs';
import path from 'path';
import os from 'os';

const MyOctokit = Octokit.plugin(retry);

const octokit = new MyOctokit({
  auth: process.env.GITHUB_TOKEN,
});

function getLatestMetricsFile() {
  const latestFile = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith('-metrics.csv'))
    .sort((a, b) => {
      const dateA = new Date(a.slice(0, 4), a.slice(5, 7), a.slice(8, 10));
      const dateB = new Date(b.slice(0, 4), b.slice(5, 7), b.slice(8, 10));
      return dateA.getTime() - dateB.getTime();
    });

  return latestFile.pop();
}

function readMetricsFile(filePath, ignoreHeaders = true) {
  const lines = [];
  const linesByIssueNumber = {};
  const metricsFile = fs.readFileSync(filePath, 'utf8');
  metricsFile.split(os.EOL).forEach((line, index) => {
    if (index === 0 && ignoreHeaders) {
      return; // Ignore headers
    }

    const values = line.split(';');
    if (values.length === 1) {
      return; // Ignore empty lines
    }

    linesByIssueNumber[values[0]] = values;
    lines.push(line);
  });

  return [lines, linesByIssueNumber];
}

async function run() {
  let linesFromPreviousFile = [];
  let existingIssues = {};
  const latestFile = getLatestMetricsFile();
  if (latestFile) {
    const latestFilePath = path.join(__dirname, latestFile);
    const result = readMetricsFile(latestFilePath);
    linesFromPreviousFile = result[0];
    existingIssues = result[1];
    console.log(`Loaded ${linesFromPreviousFile.length} issues from ${latestFile}`);
  }

  let linesFromTempFile = [];
  let issuesAlreadyFetched = {};
  const tempFilePath = path.join(__dirname, 'metrics.csv.tmp');
  if (fs.existsSync(tempFilePath)) {
    const result = readMetricsFile(tempFilePath, false);
    linesFromTempFile = result[0];
    issuesAlreadyFetched = result[1];
    console.log(`Loaded ${linesFromTempFile.length} issues from temp file`);
  }

  const issues = await octokit.paginate('GET /repos/mui/mui-x/issues', {
    state: 'all',
    per_page: 100,
    sort: 'created',
    direction: 'desc',
    since: latestFile ? `${latestFile.slice(0, 10)}T00:00:00Z` : '2023-06-01T00:00:00Z',
  });

  const headers = [
    'Issue number',
    'Title',
    'State',
    'Author',
    'Created at',
    'Remove "needs triage" label',
    'First comment',
    'Resolution',
    'Has Order ID',
    'Component',
  ].join(';');

  console.log(`Fetched ${issues.length} issues`);

  const lines = await Promise.all(
    issues.map(async (issue) => {
      if (existingIssues[issue.number] || issuesAlreadyFetched[issue.number]) {
        return null; // Already fetched
      }

      if (issue.pull_request) {
        return null; // Ignore pull requests
      }

      const createdAtMillis = new Date(issue.created_at).getTime();
      const hasOrderID = /Order ID[^\d]+\d+/.test(issue.body);

      let hoursUntilResolution = '';
      if (issue.closed_at) {
        const closedAtMillis = new Date(issue.closed_at).getTime();
        hoursUntilResolution = Math.round((closedAtMillis - createdAtMillis) / 1000 / 3600);
      }

      const events = await octokit.request(`GET /repos/mui/mui-x/issues/${issue.number}/events`);
      const comments = await octokit.request(
        `GET /repos/mui/mui-x/issues/${issue.number}/comments`,
      );

      const removeNeedsTriageLabelEvent = events.data.find((event) => {
        return event.event === 'unlabeled' && event.label.name === 'status: needs triage';
      });

      let hoursUntilTriage = '';
      if (removeNeedsTriageLabelEvent) {
        const labelRemovalMillis = new Date(removeNeedsTriageLabelEvent.created_at).getTime();
        hoursUntilTriage = Math.round((labelRemovalMillis - createdAtMillis) / 1000 / 3600);
      }

      const firstCommentFromMember = comments.data.find(
        (comment) => comment.author_association === 'MEMBER',
      );

      let hoursUntilFirstComment = '';
      if (firstCommentFromMember) {
        const firstCommentMillis = new Date(firstCommentFromMember.created_at).getTime();
        hoursUntilFirstComment = Math.round((firstCommentMillis - createdAtMillis) / 1000 / 3600);
      }

      const labels = issue.labels
        .filter((label) => label.name.startsWith('component:'))
        .map((label) => label.name)
        .join(',');

      const line = [
        issue.number,
        issue.title,
        issue.state,
        issue.user.login,
        issue.created_at.replace('T', ' ').slice(0, -1),
        hoursUntilTriage,
        hoursUntilFirstComment,
        hoursUntilResolution,
        hasOrderID,
        labels,
      ].join(';');

      fs.appendFileSync(tempFilePath, `${line}${os.EOL}`);

      return line;
    }),
  );

  const filteredLines = lines.filter((line) => line !== null);
  if (filteredLines.length > 0) {
    const fileName = `${new Date().toISOString().slice(0, 10)}-metrics.csv`;
    const content = [headers, ...linesFromPreviousFile, ...linesFromTempFile, ...filteredLines, ''];
    fs.writeFileSync(path.join(__dirname, fileName), content.join(os.EOL));
    fs.rmSync(tempFilePath);
  }
}

run().catch((error) => {
  console.error(error.message);
});
