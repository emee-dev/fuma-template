import { unlink } from "fs/promises";

export const TEMPLATE_FILE = "tenant.json";
export const ARCHIVE_FILE = "artifact.zip";

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.warn(`File not found (skipped): ${filePath}`);
      return;
    }
    console.error(`Error deleting file ${filePath}:`, err);
  }
}
