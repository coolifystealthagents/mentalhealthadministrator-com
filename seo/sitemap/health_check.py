#!/usr/bin/env python3
import urllib.request,sys
url='https://mentalhealthadministrator.com/sitemap.xml'
try:
 with urllib.request.urlopen(url,timeout=20) as r:ok=r.status==200 and b'<urlset' in r.read()
except Exception as e:print(e);raise SystemExit(2)
print('Sitemap healthy.' if ok else 'Sitemap invalid.');raise SystemExit(0 if ok else 1)
