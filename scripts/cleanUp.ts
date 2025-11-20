import path from "node:path";
import { ARCHIVE_FILE, deleteFile, TEMPLATE_FILE } from "./utils";

async function cleanUp() {
  const cwd = process.cwd();
  const artifactPath = path.join(cwd, TEMPLATE_FILE);
  const archivePath = path.join(cwd, ARCHIVE_FILE);

  await Promise.allSettled([deleteFile(artifactPath), deleteFile(archivePath)]);
}

cleanUp();
