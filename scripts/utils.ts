import { unlink } from "fs/promises";

export async function deleteFile(filePath: string) {
  try {
    await unlink(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    } else {
      process.exit(1);
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }
}
