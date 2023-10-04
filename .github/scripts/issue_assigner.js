const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const context = github.context;
    const payload = context.payload;
    const commentBody = payload.comment.body;
    const commenter = payload.comment.user.login;
    const authorizedUser = 'princerajpoot20';

    if (commenter !== authorizedUser) {
      console.log('Commenter is not authorized to perform assignments.');
      return;
    }

    const command = commentBody.trim();
    const assigneeNames = command.split(' ').slice(1).map(s => s.replace('@', ''));

    if (command.startsWith('/assign')) {
      await addAssignees(assigneeNames);
    } else if (command.startsWith('/unassign')) {
      await removeAssignees(assigneeNames);
    }

  } catch (error) {
    core.setFailed(`Action failed with error ${error}`);
  }
}

async function addAssignees(assigneeNames) {
  const issueNumber = github.context.issue.number;
  const repoName = github.context.repo.repo;
  const repoOwner = github.context.repo.owner;

  const endpoint = `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumber}/assignees`;
  const headers = {
    Authorization: `token ${process.env.GH_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  };

  const response = await axios.post(endpoint, { assignees: assigneeNames }, { headers: headers });

  if (response.status !== 201) {
    throw new Error(`Failed to add assignees. Status: ${response.status}`);
  }
}

async function removeAssignees(assigneeNames) {
  const issueNumber = github.context.issue.number;
  const repoName = github.context.repo.repo;
  const repoOwner = github.context.repo.owner;

  for (const assignee of assigneeNames) {
    const endpoint = `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumber}/assignees/${assignee}`;
    const headers = {
      Authorization: `token ${process.env.GH_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    };

    const response = await axios.delete(endpoint, { headers: headers });

    if (response.status !== 204) {
      throw new Error(`Failed to remove assignee ${assignee}. Status: ${response.status}`);
    }
  }
}

run();
