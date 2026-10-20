// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, rm, realpath} from 'node:fs/promises';
import {join, dirname, basename} from 'node:path';
import {tmpdir} from 'node:os';
import {buildManifest} from './manifest.mjs';

test('manifest detects content changes and excludes dependency/Git directories', async () => {
  const root = await mkdtemp(join(tmpdir(), 'live2d-notes-test-'));
  try {
    await mkdir(join(root, '.git'));
    await mkdir(join(root, 'sub'));
    await writeFile(join(root, '.git', 'ignored'), 'not a runtime asset');
    await writeFile(join(root, 'sub', 'asset.txt'), 'first');
    const first = await buildManifest(root);
    assert.equal(first.length, 1);
    assert.equal(first[0].path, 'sub/asset.txt');
    await writeFile(join(root, 'sub', 'asset.txt'), 'second');
    const second = await buildManifest(root);
    assert.notEqual(first[0].sha256, second[0].sha256);
    assert.equal(second[0].bytes, 6);
  } finally {
    // Verify the resolved absolute target before recursive cleanup on Windows.
    const cleanup = await realpath(root);
    assert.equal(dirname(cleanup), await realpath(tmpdir()));
    assert.ok(basename(cleanup).startsWith('live2d-notes-test-'));
    await rm(cleanup, {recursive: true, force: true});
  }
});
