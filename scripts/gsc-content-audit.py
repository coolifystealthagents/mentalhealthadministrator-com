#!/usr/bin/env python3
import json,os
print(json.dumps({'ok':False,'reason':'GSC credentials are required','site':os.getenv('GSC_SITE','mentalhealthadministrator.com')}))
raise SystemExit(2)
