"""Read-only model3 reference and hash inspection; NOT a MOC/Core validator.
SPDX-License-Identifier: MIT
"""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import sys


def inspect(model_file):
    model = Path(model_file).resolve()
    root = model.parent
    errors, files, refs = [], {}, []
    report = {
        'status': 'structural-fail', 'scope': 'model3 references and file hashes only',
        'nativeExportVerified': False, 'visualAcceptance': 'unknown',
        'files': files, 'errors': errors,
    }
    try:
        data = json.loads(model.read_text(encoding='utf-8-sig'))
    except (OSError, UnicodeError, ValueError):
        errors.append('Cannot read a valid UTF-8 model3 JSON file')
        return report
    if not isinstance(data, dict) or data.get('Version') != 3:
        errors.append('Expected a model3 object with Version 3')
        return report
    references = data.get('FileReferences')
    if not isinstance(references, dict):
        errors.append('FileReferences must be an object')
        return report

    def add(value, field):
        if not isinstance(value, str) or not value.strip():
            errors.append(field + ': expected a nonempty local file reference')
        else:
            refs.append((value, field))

    add(references.get('Moc'), 'Moc')
    textures = references.get('Textures')
    if not isinstance(textures, list) or not textures:
        errors.append('Textures must be a nonempty list')
    else:
        for i, value in enumerate(textures):
            add(value, f'Textures[{i}]')
    for key in ('Physics', 'Pose', 'DisplayInfo', 'UserData'):
        if key in references:
            add(references[key], key)

    def items(value, field, sound=False):
        if not isinstance(value, list):
            errors.append(field + ': expected a list')
            return
        for i, entry in enumerate(value):
            if not isinstance(entry, dict):
                errors.append(f'{field}[{i}]: expected an object')
                continue
            add(entry.get('File'), f'{field}[{i}].File')
            if sound and 'Sound' in entry:
                add(entry['Sound'], f'{field}[{i}].Sound')

    if 'Expressions' in references:
        items(references['Expressions'], 'Expressions')
    if 'Motions' in references:
        motions = references['Motions']
        if not isinstance(motions, dict):
            errors.append('Motions must be an object')
        else:
            for name, value in motions.items():
                items(value, f'Motions.{name}', sound=True)

    def hash_file(path, label):
        try:
            digest = hashlib.sha256()
            with path.open('rb') as handle:
                for block in iter(lambda: handle.read(1024 * 1024), b''):
                    digest.update(block)
            size = path.stat().st_size
            files[label] = {'bytes': size, 'sha256': digest.hexdigest()}
            if size == 0:
                errors.append(label + ': file is empty')
        except OSError:
            errors.append(label + ': missing or unreadable file')

    hash_file(model, model.name)
    for raw, field in refs:
        normalized = raw.replace('\\', '/')
        relative = PurePosixPath(normalized)
        # Restrict this inspector to a portable local package, not URL fetching.
        if relative.is_absolute() or '..' in relative.parts or ':' in normalized or '\x00' in raw:
            errors.append(field + ': reference must remain inside the model directory')
            continue
        path = (root / normalized).resolve()
        if not path.is_relative_to(root):
            errors.append(field + ': resolved path escapes the model directory')
            continue
        label = relative.as_posix()
        if label not in files:
            hash_file(path, label)
    report['status'] = 'structural-fail' if errors else 'structural-pass'
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('model', type=Path, help='Path to a model3.json; never modified')
    args = parser.parse_args()
    report = inspect(args.model)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return int(bool(report['errors']))


if __name__ == '__main__':
    sys.exit(main())
