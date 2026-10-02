#!/usr/bin/env python3
import argparse,urllib.parse,urllib.request
p=argparse.ArgumentParser();p.add_argument('url');p.add_argument('--execute',action='store_true');a=p.parse_args()
if not a.execute:print('Dry run. Add execute flag to create an archive request.');raise SystemExit(0)
with urllib.request.urlopen('https://web.archive.org/save/'+urllib.parse.quote(a.url,safe=':/'),timeout=30) as r:print(r.status)
