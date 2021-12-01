const axios = require('axios');
const argv = require('yargs/yargs')(process.argv.slice(2)).argv;

const releaseBranch = argv.releaseBranch || 'master';
const nextVersion = argv.nextVersion || '5.X.X';

const main = async () => {
  const currentVersion = await axios
    .get('https://api.github.com/repos/mui-org/material-ui-x/tags?per_page=1')
    .then((response) => {
      return response.data[0].name;
    });

  const GIT_COMPARE_URL = `https://api.github.com/repos/mui-org/material-ui-x/compare/${currentVersion}...${releaseBranch}`;

  const { authors, commits } = await axios
    .get(GIT_COMPARE_URL)
    .then((response) => {
      // console.log(response.data);
      // console.log(response.data.explanation);
      const fetchedAuthors = {};

      const fetchedCommits = [];
      response.data.commits.forEach(({ author: { login }, commit: { message } }) => {
        if (login !== 'renovate[bot]') {
          fetchedCommits.push(`${message} @${login}`);
          fetchedAuthors[login] = true;
        }
      });

      return { authors: fetchedAuthors, commits: fetchedCommits };
    })
    .catch((error) => {
      console.log(error);
    });

  const changeCommits = [];
  const coreCommits = [];
  const docsCommits = [];
  const otherCommits = [];

  commits.forEach((commitMessage) => {
    const endIndex = commitMessage.indexOf(']');
    if (endIndex === -1) {
      otherCommits.push(commitMessage);
      return;
    }
    switch (commitMessage.slice(1, endIndex)) {
      case 'DataGrid':
      case 'DataGridPro':
        changeCommits.push(commitMessage);
        break;
      case 'docs':
        docsCommits.push(commitMessage);
        break;
      case 'core':
        coreCommits.push(commitMessage);
        break;
      default:
        otherCommits.push(commitMessage);
        break;
    }
  });

  const getCommitCategories = (commitsList, header) => {
    if (commitsList.length === 0) {
      return '';
    }
    return `${header}

${commitsList
  .sort()
  .map((message) => `- ${message}`)
  .join('\n')}
    `;
  };

  const message = `

## ${nextVersion}
  
_Xxx XX, 2021_

A big thanks to the ${
    Object.keys(authors).length
  } contributors who made this release possible. Here are some highlights ✨:
  
-
-
-


### ${'`'}@mui/x-data-grid@v${nextVersion}${'`'} / ${'`'}@mui/x-data-grid-pro@v${nextVersion}${'`'}

${getCommitCategories(changeCommits, '### Changes')}
${getCommitCategories(coreCommits, '### Core')}
${getCommitCategories(docsCommits, '### Docs')}
${getCommitCategories(otherCommits, '')}

`;

  console.log(message);
};

main();
// // // get the changelog message from pull request id
// // const get_PR_content = `https://api.github.com/repos/mui-org/material-ui-x/pulls/${PR_ID}`;
