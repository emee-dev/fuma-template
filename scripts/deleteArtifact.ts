import { Octokit } from "octokit";

const token = process.env.ARTIFACT_TOKEN as string;
const runId = process.env.RUN_ID as string;
const repoOwner = process.env.REPO_OWNER as string;
const repoName = process.env.REPO_NAME as string;

const octokit = new Octokit({ auth: token });

async function deleteArtifacts() {
  const artifacts = await octokit.rest.actions.listWorkflowRunArtifacts({
    owner: repoOwner,
    repo: repoName,
    run_id: Number(runId),
  });

  console.log(`Found ${artifacts.data.artifacts.length} artifacts.`);

  for (const artifact of artifacts.data.artifacts) {
    console.log(`Deleting artifact: ${artifact.name} (${artifact.id})`);
    await octokit.rest.actions.deleteArtifact({
      owner: repoOwner,
      repo: repoName,
      artifact_id: artifact.id,
    });
  }
}

deleteArtifacts();
