#!/usr/bin/env python3
import pathlib,sys
root=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else '.')
changed=0
for p in root.rglob('*'):
 if p.is_file() and p.suffix in {'.md','.mdx','.txt','.tsx','.ts'}:
  s=p.read_text(errors='ignore');n=s.replace('\u2014',',').replace('\u2013',' to ')
  if n!=s:p.write_text(n);changed+=1
print(f'Updated {changed} files')
