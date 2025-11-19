import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { deleteFile } from "./utils";

type Sources = {
  data: string;
  fileName: string;
};

const payloadPath = path.join(process.cwd(), "tenant.json");
const content = await readFile(payloadPath, "utf-8");
const payload: { files: Sources[] } = JSON.parse(content);

const files = payload.files || [];

if (!Array.isArray(files)) {
  console.error("Invalid payload: files must be an array");
  process.exit(1);
}

for (const file of files) {
  const filePath = path.join(process.cwd(), file.fileName);

  // Ensure parent directory exists
  await mkdir(path.dirname(filePath), { recursive: true });

  // Write file
  await writeFile(filePath, file.data, "utf-8");
  console.log(`✔ Wrote: ${file.fileName}`);
}

// Clean up
await deleteFile(payloadPath);

console.log("All files written successfully.");
