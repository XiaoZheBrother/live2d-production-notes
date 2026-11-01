"""Package only portable skill resources, without caches or project assets.
SPDX-License-Identifier: MIT
"""
import argparse
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / 'skills/live2d-production'


def package(output):
    output = Path(output).resolve()
    if output.is_relative_to(SKILL.resolve()):
        raise ValueError('Archive must be outside the skill source directory')
    files = [SKILL / 'SKILL.md', SKILL / 'LICENSE.txt']
    for folder, extension in (('agents', '*.yaml'), ('references', '*.md'), ('scripts', '*.py')):
        files.extend(sorted((SKILL / folder).glob(extension)))
    for path in files:
        if not path.is_file() or path.is_symlink() or not path.resolve().is_relative_to(SKILL.resolve()):
            raise ValueError('Invalid skill resource: ' + path.name)
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, 'x', compression=zipfile.ZIP_DEFLATED) as archive:
        for path in files:
            archive.write(path, path.relative_to(SKILL.parent).as_posix())
    return len(files)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path, help='New archive path; existing file is not overwritten')
    args = parser.parse_args()
    print(f'Packaged {package(args.output)} skill resources.')
