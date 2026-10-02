import {defineConfig,globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    files:['scripts/**/*.cjs'],
    rules:{'@typescript-eslint/no-require-imports':'off'},
  },
  {
    rules:{
      '@next/next/no-img-element':'off',
      '@next/next/no-location-assign-relative-destination':'off',
    },
  },
  globalIgnores(['.next/**','.tools/**','out/**','build/**','next-env.d.ts','thumbnail-system/templates/**']),
]);
