import { writeFile } from "node:fs/promises";
import { Octokit } from "octokit";
import { $ } from "bun";
import path from "node:path";
import { ARCHIVE_FILE } from "./utils";

const token = process.env.ARTIFACT_TOKEN as string;
const artifactName = process.env.ARTIFACT_NAME as string;
const runId = process.env.RUN_ID as string;
const repoOwner = process.env.REPO_OWNER as string;
const repoName = process.env.REPO_NAME as string;

const octokit = new Octokit({ auth: token });

async function fetchArtifact() {
  const cwd = process.cwd();
  console.log("Fetching artifact metadata...");

  const artifacts = await octokit.rest.actions.listWorkflowRunArtifacts({
    owner: repoOwner,
    repo: repoName,
    run_id: Number(runId),
  });

  const artifact = artifacts.data.artifacts.find(
    (a) => a.name === artifactName
  );

  if (!artifact) {
    console.error("Artifact not found");
    process.exit(1);
  }

  console.log("Downloading artifact:", artifact.name);

  const download = await octokit.rest.actions.downloadArtifact({
    owner: repoOwner,
    repo: repoName,
    artifact_id: artifact.id,
    archive_format: "zip",
  });

  const zipBuffer: Buffer = Buffer.from(
    Array.from(new Uint8Array(download.data as ArrayBuffer))
  );

  // Save archive
  await writeFile(path.join(cwd, ARCHIVE_FILE), zipBuffer);

  console.log("Artifact saved.");
  console.log("Extracting artifact...");

  // Unzip "tenant.json" into the current directory
  await $`unzip -o artifact.zip`;

  console.log("Extracted artifact");
}

fetchArtifact();


