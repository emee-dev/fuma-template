// scripts/apply-files.js
import fs from "fs";
import path from "path";

/**
 * Expected structure:
 * {
 *   files: Array<{ path: string, content: string }>
 * }
 */

const payloadPath = path.join(process.cwd(), "incoming/payload.json");
const raw = fs.readFileSync(payloadPath, "utf-8");
const payload = JSON.parse(raw);

/** @type {Array<{ path: string, content: string }>} */
const files = payload.files || [];

if (!Array.isArray(files)) {
  console.error("Invalid payload: files must be an array");
  process.exit(1);
}

for (const file of files) {
  const filePath = path.join(process.cwd(), file.path);

  // Ensure parent directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // Write file
  fs.writeFileSync(filePath, file.content, "utf-8");
  console.log(`✔ Wrote: ${file.path}`);
}

console.log("All files written successfully.");
