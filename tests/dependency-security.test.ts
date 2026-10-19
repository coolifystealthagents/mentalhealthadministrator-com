import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import path from 'node:path';

const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(readFileSync(path.join(root,'package.json'),'utf8'));
const lockfile=JSON.parse(readFileSync(path.join(root,'package-lock.json'),'utf8'));

const lockedVersion=(name:string)=>lockfile.packages[`node_modules/${name}`]?.version;

describe('production dependency security floor',()=>{
  it('pins a consistent patched Next.js toolchain and image-processing release',()=>{
    expect(manifest.dependencies.next).toBe('16.4.2');
    expect(manifest.dependencies['@next/mdx']).toBe('16.4.2');
    expect(manifest.devDependencies['eslint-config-next']).toBe('16.4.2');
    expect(manifest.dependencies.sharp).toBe('0.35.5');
    expect(lockedVersion('next')).toBe('16.4.2');
    expect(lockedVersion('@next/mdx')).toBe('16.4.2');
    expect(lockedVersion('eslint-config-next')).toBe('16.4.2');
    expect(lockedVersion('sharp')).toBe('0.35.5');
  });

  it('overrides the vulnerable source-map implementation',()=>{
    expect(manifest.overrides?.['source-map-js']).toBe('1.2.2');
    expect(lockedVersion('source-map-js')).toBe('1.2.2');
  });
});
