import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { TEMPLATE_FILE } from "./utils";

type Sources = {
  data: string;
  fileName: string;
};

export async function applyFiles(): Promise<void> {
  const cwd: string = process.cwd();
  const artifactPath: string = path.join(cwd, TEMPLATE_FILE);

  let json: any;
  try {
    json = await import(artifactPath, {
      assert: { type: "json" },
    });
  } catch (err) {
    console.error("Failed to load template JSON file:", err);
    process.exit(1);
  }

  const files: Sources[] = json?.default ?? [];

  if (!Array.isArray(files)) {
    console.error("Invalid payload: expected an array of files.");
    process.exit(1);
  }

  for (const file of files) {
    if (!file?.fileName || typeof file.fileName !== "string") {
      console.warn("Skipped invalid file entry:", file);
      continue;
    }

    const filePath: string = path.join(cwd, file.fileName);
    const dir: string = path.dirname(filePath);

    try {
      // Ensure directory exists
      await mkdir(dir, { recursive: true });

      // Write the file (overwrite mode)
      await writeFile(filePath, file.data ?? "", "utf-8");

      console.log(`✔ Wrote: ${file.fileName}`);
    } catch (err) {
      console.error(`Failed writing ${file.fileName}:`, err);
      process.exit(1);
    }
  }

  console.log("All files processed.");
}

applyFiles();
