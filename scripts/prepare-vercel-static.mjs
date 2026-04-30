import { copyFile, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const clientDir = path.resolve("dist/client");
const indexPath = path.join(clientDir, "index.html");
const shellPath = path.join(clientDir, "_shell.html");
const notFoundPath = path.join(clientDir, "404.html");

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

await mkdir(clientDir, { recursive: true });

if (!(await exists(indexPath))) {
  if (await exists(shellPath)) {
    await copyFile(shellPath, indexPath);
  } else {
    throw new Error("Vercel static build is missing dist/client/index.html and dist/client/_shell.html");
  }
}

await copyFile(indexPath, notFoundPath);
console.log("Prepared dist/client for Vercel static hosting.");
