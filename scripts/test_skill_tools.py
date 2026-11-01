"""Synthetic package checks; no character assets or Core. SPDX-License-Identifier: MIT"""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'skills/live2d-production/scripts/inspect_package.py'
spec = importlib.util.spec_from_file_location('inspect_package', SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PackageTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.model = self.root / 'test.model3.json'
        self.refs = {'Moc': 'dummy.moc3', 'Textures': ['atlas.png'],
                     'Motions': {'Idle': [{'File': 'idle.motion3.json'}]}}
        for name in ('dummy.moc3', 'atlas.png', 'idle.motion3.json'):
            (self.root / name).write_bytes(b'not a real Cubism asset')
        self.save()

    def save(self):
        self.model.write_text(json.dumps({'Version': 3, 'FileReferences': self.refs}), encoding='utf-8')

    def test_structural_success_does_not_claim_native_or_visual_acceptance(self):
        before = {p.name: p.read_bytes() for p in self.root.iterdir()}
        report = module.inspect(self.model)
        self.assertEqual(report['status'], 'structural-pass')
        self.assertFalse(report['nativeExportVerified'])
        self.assertEqual(report['visualAcceptance'], 'unknown')
        self.assertEqual(len(report['files']), 4)
        self.assertEqual(before, {p.name: p.read_bytes() for p in self.root.iterdir()})

    def test_missing_motion_and_empty_texture_fail(self):
        (self.root / 'idle.motion3.json').unlink()
        (self.root / 'atlas.png').write_bytes(b'')
        report = module.inspect(self.model)
        self.assertEqual(len(report['errors']), 2)

    def test_traversal_absolute_and_remote_references_fail(self):
        for value in ('../outside.png', '..\\outside.png', '/outside.png', 'C:/outside.png', 'https://example.org/x'):
            with self.subTest(value=value):
                self.refs['Textures'] = [value]
                self.save()
                self.assertEqual(module.inspect(self.model)['status'], 'structural-fail')

    def test_symlink_escape_is_not_hashed(self):
        with tempfile.TemporaryDirectory() as other:
            target = Path(other) / 'outside.png'
            target.write_bytes(b'private')
            link = self.root / 'external.png'
            try:
                link.symlink_to(target)
            except OSError:
                self.skipTest('Host does not permit file symlinks')
            self.refs['Textures'] = ['external.png']
            self.save()
            report = module.inspect(self.model)
            self.assertTrue(report['errors'])
            self.assertNotIn('external.png', report['files'])

    def test_malformed_shapes_fail_without_crash(self):
        for value in ([], {}, {'Version': 3, 'FileReferences': {'Moc': 4, 'Textures': 'bad', 'Motions': []}}):
            self.model.write_text(json.dumps(value), encoding='utf-8')
            self.assertTrue(module.inspect(self.model)['errors'])

    def test_cli_exit_code_and_json(self):
        self.refs['Expressions'] = [{'Name': 'smile', 'File': 'missing.exp3.json'}]
        self.save()
        result = subprocess.run([sys.executable, str(SCRIPT), str(self.model)], capture_output=True, text=True)
        self.assertEqual(result.returncode, 1)
        self.assertEqual(json.loads(result.stdout)['status'], 'structural-fail')


if __name__ == '__main__':
    unittest.main()
