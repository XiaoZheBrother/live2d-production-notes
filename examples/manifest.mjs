// SPDX-License-Identifier: MIT
import {createHash} from 'node:crypto';
import {readdir, readFile, realpath} from 'node:fs/promises';
import {resolve, relative, join} from 'node:path';
import {pathToFileURL} from 'node:url';

export async function buildManifest(directory) {
  const root = await realpath(directory);
  const entries = [];
  const ignored = new Set(['.git', 'node_modules', '__pycache__', '.local']);
  async function visit(dir) {
    const children = await readdir(dir, {withFileTypes: true});
    children.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    for (const child of children) {
      if (child.isSymbolicLink() || ignored.has(child.name)) continue;
      const path = join(dir, child.name);
      if (child.isDirectory()) await visit(path);
      else if (child.isFile()) {
        const bytes = await readFile(path);
        entries.push({
          path: relative(root, path).split('\\').join('/'),
          bytes: bytes.length,
          sha256: createHash('sha256').update(bytes).digest('hex'),
        });
      }
    }
  }
  await visit(root);
  return entries;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.argv[2]) {
    console.error('Usage: node examples/manifest.mjs <directory>');
    process.exitCode = 2;
  } else {
    try {
      console.log(JSON.stringify(await buildManifest(process.argv[2]), null, 2));
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
