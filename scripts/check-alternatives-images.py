#!/usr/bin/env python3
import pathlib,sys
root=pathlib.Path('content/alternatives');missing=[]
for p in root.glob('*.md*'):
 text=p.read_text(errors='ignore')
 if 'image:' not in text:missing.append(str(p))
if missing:print('\n'.join(missing));raise SystemExit(1)
print('Alternative image check passed.')
