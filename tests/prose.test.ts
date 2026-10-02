import {describe,expect,it} from 'vitest';import fs from 'node:fs';import path from 'node:path';
describe('forbidden prose',()=>{it('scanner rejects banned punctuation',()=>{const s=fs.readFileSync(path.resolve(__dirname,'../ban_dashes.py'),'utf8');expect(s).toContain('\\u2014');expect(s).toContain('\\u2013')})});
